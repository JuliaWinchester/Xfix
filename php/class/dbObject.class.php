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
	public $id;
	public $data;
	public $datafields

		function __construct($data)
	{
		$this->data = $data;
		$this->unpackdata();
	}

	/**
	* Unpacks database row array and sorts values into variables as appropriate.
	* This method is replaced in child classes for type-specific behavior. 
	*
	* @access public 
	*/
	function unpackdata() 
	{
		$this->id = $this->data['id'];
		$this->datafields = ['id'];
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
	function mergeSubObjects($sub_object_array)
	{
		$obj_tiers = ['section','model','view','label'];
		$obj_type = get_class($this);
		$obj_type_index = array_search($obj_type, $obj_tiers);
		$sub_obj_types = array_map('get_class', $sub_object_array);

		if (count(array_unique($sub_obj_types)) != 1) { return FALSE;}
		$sub_obj_type_index = array_search($sub_obj_types[0], $obj_tiers); 
		if (($obj_type_index + 1) != $sub_obj_type_index) { return FALSE;}

		// for class section, need to add $sub_object_array to $models
		$var_name = $obj_tiers[$sub_obj_type_index]."s";
		$this->{$var_name} = array_merge($this->{$var_name}, $sub_object_array);
		return TRUE; 
	}
}
?>