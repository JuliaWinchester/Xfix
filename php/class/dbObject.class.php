<?php

/**    
* DBObject is a parent class for Xfix database objects (sections, models, 
* views, labels, items). Specific object classes inherit DBObject and are 
* created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class DBObject
{
	protected $db_row;
	protected $data;
	public $tiers = ['Section','Model','View','Label'];

	// Static functions

	/**
	 * Merges a variable number of DBObjects with a variable number of sub-level
	 * DBObjects. DBObjects are merged along a sub-object hierarchy, section -> 
	 * model -> view -> label. DBObject child types are associated with the type 
	 * immediately higher in the hierarchy in a many to one manner. Section,
	 * model, and view objects can contain a collection of model, view, and
	 * label objects respectively.   
	 *
	 * @param array $objs Array of DBObjects to be merged into
	 * @param array $sub_objs Array of DBObjects to merge into $objs
	 * @return array Array of objects with sub-level objects incorporated
	 * @access public
	 */
	public static function mergeObjects($objs, $sub_objs)
	{
		$tiers = ['Section','Model','View','Label'];
		$objs_t = array_map('get_class', $objs);
		$sub_objs_t = array_map('get_class', $sub_objs);
		
		// Validation and error handling
		if (count(array_unique($objs_t)) != 1)
		{
			return FALSE; // Error later
		} elseif (count(array_unique($sub_objs_t)) != 1) {
			return FALSE; // Error later
		} elseif ((array_search($obj_t[0], $tiers) + 1) != 
				   array_search($sub_obj_t[0], $tiers))
		{
			return FALSE; // Error later
		}
		
		// Ensure top object array is indexed by id
		$obj_array = [];
		foreach ($objs as $key => $value) {
			$obj_array[$value->id] = $value;
		}

		// Merge top and sub objects
		$top_id = strtolower($objs_t[0])."_id"
		$sub_array_name = strtolower($sub_objs_t)."s";

		foreach ($sub_objs as $index => $s_obj) {
			$obj_i = $s_obj->data[$top_id];
			$obj_array[$obj_i]->data[$sub_array_name][$s_obj->id] = $s_obj;
		}

		// Check for duplicate sub-objects
		foreach ($obj_array as $index => $obj) {
			$obj->removeDuplicateSubObjs();
		}

		return $obj_array;
	}

	// Instance functions

	function __construct($db_row)
	{
		$this->db_row = $db_row;
		$this->unpackData();
	}

	public function __set($variable, $value)
	{
		$this->data[$variable] = $value;	
	}

	public function __get($variable)
	{
		if (isset($this->data[$variable])){
			return $this->data[$variable];
		} else {
			die('Unknown variable '.$variable.' in object '.$this);
		}
	}

	/**
	* Unpacks database row array and sorts values into variables as appropriate.
	* This method is replaced in child classes for type-specific behavior. 
	*
	* @access public 
	*/
	protected function unpackData() 
	{
		$this->data['id'] = $this->db_row['id'];
	}

	/**
	* This method checks for duplicate sub-level objects, alerts when
	* duplicates are found, and removes duplicates as necessary. 
	*
	* @access public 
	*/
	protected function removeDuplicateSubObjs()
	{
		$sub = $this->tiers[
						array_search(get_class($this), $this->tiers) + 1]."s";
		if (count($this->data[$sub]) != count(array_unique($this->data[$sub]))) {
			echo "Duplicate sub-objects found in ".get_class($this)." object!";
			echo "Duplicate sub-objects being removed.";
			$this->data[$sub] = array_unique($this->data[$sub]);
		}
	}

	/**
	 * Merges DBObject classes along a sub-object
	 * hierarchy, section -> model -> view -> label. DBObject child types are 
	 * associated with the type immediately higher in the hierarchy in a many to 
	 * one manner. Each of the first three DBobject child types can contain a  
	 * collection of objects belonging to the type immediately below (section
	 * objects contain model objects, model objects contain view objects, etc.).
	 * This method incorporates a collection of databases objects into a single
	 * database object immediately higher in the hierarchy given.  
	 *
	 * @param array $sub_object_array Array of DBObjects to merge
	 * @return bool Success or failure of sub-object merge
	 * @access public
	 */
	protected function mergeSubObjects($sub_object_array)
	{
		$obj_type = get_class($this);
		$obj_type_index = array_search($obj_type, $this->tiers);
		$sub_obj_types = array_map('get_class', $sub_object_array);

		if (count(array_unique($sub_obj_types)) != 1) { return FALSE;}
		$sub_obj_type_index = array_search($sub_obj_types[0], $this->tiers); 
		if (($obj_type_index + 1) != $sub_obj_type_index) { return FALSE;}

		// for class section, need to add $sub_object_array to $models
		$sub_array = $sub_obj_types[0]."s";
		$this->data[$sub_array] = array_merge($this->data[$sub_array], $sub_object_array);
		$this->removeDuplicateSubObjs();
		return TRUE; 
	}
}

?>