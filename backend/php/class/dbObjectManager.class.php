<?php

/**    
* DBObjectManager constructs and manages database operations for DBObject child 
* class objects (chapters, specimens, perspectives, labels, items). This class acts as a
* factory generating DBObjects and provides a DBObject-specific interface
* for database create, read, update, and delete functionality. 
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/

include_once 'Chapter.class.php';
include_once 'Specimen.class.php';
include_once 'Perspective.class.php';
include_once 'Label.class.php';
include_once 'Item.class.php';
include_once 'Perspective_Item.class.php';

class DBObjectManager
{
	protected $DB;

	function __construct($DB)
	{
		$this->DB = $DB;
	}

	protected function flattenArray($a)
	{
		return call_user_func_array('array_merge', 
									array_map('array_values', $a));
	}

	protected function validateObjClass($o)
	{
		if (gettype($o) == 'string') {
			$class = $o;
		} elseif (gettype($o) == 'object') {
			$class = get_class($o);
		} else {
			return FALSE; // Error later
		}

		$valid_classes = ['Chapter','Specimen','Perspective','Label','Item','Perspective_Item'];

		if (in_array($class, $valid_classes)) {
			return TRUE; 
		} else {
			return FALSE; // Error later
		}

	}

	public function countDBObject($obj_class, $column, $where = NULL)
	{
		$this->validateObjClass($obj_class);

		return $this->DB->read(strtolower($obj_class), $where, $column, 
			$distinct = false, $count = true);
	}

	############################################################################
	# Methods for single DBObjects
	############################################################################

	/**
	 * Reads a database row corresponding to the $obj_class type with a primary
	 * key ID $id and returns an appropriate $obj_class object. 
	 *
	 * @param string $obj_class One of ['chapter','specimen','perspective','label','item']
	 * @param integer $id Primary key ID of database row for object
	 * @return array Array containing chapter, specimen, perspective, label, item object
	 * @access public
	 */
	public function readObject($obj_class, $id)
	{
		$this->validateObjClass($obj_class);
		$result = $this->DB->read(strtolower($obj_class),['id','=',$id]);
		if (count($result) == 0) {
			return array();
		} else {
			return array(new $obj_class($result[0]));
		}
		
	}

	/**
	 * Saves data from a DBObject chapter, specimen, label, perspective, or item object
	 * to SQL database by either creating a new entry or updating a previous
	 * entry.
	 *
	 * @param DBObject $obj Chapter, specimen, label, perspective, or item object
	 * @return DBObject Created or updated DBObject
	 * @access public
	 */
	public function saveObject($obj, $type=NULL)
	{
		if (!$type) { $type = get_class($obj); }

		$this->validateObjClass($type);

		if (isset($obj->data['id'])) {
			$obj_data = array_intersect_key($obj->data, 
				array_flip($obj->data['save_fields']));
			$this->DB->update($type, array_keys($obj_data), 
				array_values($obj_data), $obj->data['id']);
			return $obj;
		} else {
			if (isset($obj->data['save_fields'])) {
				$obj_data = array_intersect_key($obj->data, 
				array_flip($obj->data['save_fields']));
				$new_id = $this->DB->create($type, array_keys($obj_data), 
				array_values($obj_data));
			} else {
				$new_id = $this->DB->create($type, array_keys($obj->data), 
					array_values($obj->data));
			}
			$obj->data['id'] = $new_id;
			$obj = new $type($obj->data);
			return $obj;
		}
	}

	/**
	 * Deletes data from a DBObject chapter, specimen, label, perspective, or item object
	 * from SQL database.
	 *
	 * @param DBObject $obj Chapter, specimen, label, perspective, or item object
	 * @return integer Number of affected database rows (should be 1)
	 * @access public
	 */
	public function deleteObject($obj)
	{
		$this->validateObjClass($obj);
		return $this->DB->delete(strtolower(get_class($obj)), [$obj->id]);
	}

	############################################################################
	# Methods for collections of multiple DBObjects
	############################################################################
	protected function numberObjClasses($obj_array)
	{
		return count(array_unique(array_map('get_class', $obj_array)));
	}

	protected function dbRowsToObjArray($obj_class, $db_rows)
	{
		$obj_array = [];
		foreach ($db_rows as $data) {
			//$obj_array[$data['id']] = new $obj_class($data);
			$obj_array[] = new $obj_class($data);
		}
		return $obj_array;
	}

	protected function readMatchingCollectionSpecimen($match_perspective_id)
	{
		$item_ids = $this->DB->read('perspective_item', 
									['perspective_id', '=', $match_perspective_id],'item_id');
		$perspective_ids = $this->DB->read('perspective_item', ['item_id', 'in', $item_ids], 
													'perspective_id', TRUE);

		$item_ids = $this->flattenArray($item_ids);
		$perspective_ids = $this->flattenArray($perspective_ids);

		$perspective_rows = $this->DB->read('perspective', ['id', 'in', $perspective_ids]);
		$perspective_objs = $this->dbRowsToObjArray('Perspective', $perspective_rows);

		$specimen_ids = array_map(function($x) {return $x->data['specimen_id'];}, $perspective_objs);
		$specimen_ids = array_unique($specimen_ids);

		$specimen_rows = $this->DB->read('specimen',['id', 'in', $specimen_ids]);
		$specimen_objs = $this->dbRowsToObjArray('Specimen', $specimen_rows);

		$specimen_objs = $specimen_objs[0]->mergeObjects($specimen_objs, $perspective_objs);
		return $specimen_objs;
	}

	protected function readMatchingCollectionItem($match_perspective_id)
	{
		$db_rows = $this->DB->readInnerJoin('item', 'perspective_item', 'id', 
											'item_id', ['perspective_item.perspective_id','=',
											$match_perspective_id]);
		return $this->dbRowsToObjArray('Item', $db_rows);
	}

	protected function readMatchingCollection($obj_class, $match_perspective_id)
	{
		if ($obj_class == 'Specimen') {
			return $this->readMatchingCollectionSpecimen($match_perspective_id);
		} elseif ($obj_class == 'Item') {
			return $this->readMatchingCollectionItem($match_perspective_id);
		} else {
			return FALSE; // Error later
		}
	}

	/**
	 * Reads multiple database rows corresponding to the $obj_class type with an
	 * optional where clause to specify results. Optional $match_perspective_id
	 * provides special functionality for item and specimen objects. When used to
	 * read item objects, method returns items that match a given perspective ID
	 * (i.e., all anatomical structures that appear in a given perspective). When used
	 * to read specimen objects, method returns specimens and associated perspectives that
	 * share items in common with the given perspective ID (i.e., anatomical specimens and
	 * perspectives of specimens that share an anatomical structure with a given perspective).
	 * Only one of optional parameters $where and $match_perspective_id should be used.
	 *
	 * @param string $obj_class One of ['Chapter','Specimen','Perspective','Label','Item']
	 * @param array $where ['column', '=' OR 'in', 'value' OR ['a', 'b', ...]]
	 * @param integer $match_perspective_id Perspective ID to match items and specimens to
	 * @return array Array of chapter, specimen, perspective, label, or item objects
	 * @access public
	 */
	public function readObjCollection($obj_class, $where=NULL, $match_perspective_id=NULL)
	{
		$this->validateObjClass($obj_class);

		if ($match_perspective_id) {
			if ($where) {
				return FALSE; // Error later
			}
			return $this->readMatchingCollection($obj_class, $match_perspective_id);
		}
		
		$db_rows = $this->DB->read(strtolower($obj_class),$where);
		if (count($db_rows) == 0) {
			return array();
		} else {
			return $this->dbRowsToObjArray($obj_class, $db_rows);
		}
		
	}

	/**
	 * Saves data from a an array of DBObject chapter, specimen, label, perspective, or
	 * item objects to SQL database by either creating new entries or updating
	 * previous entries.
	 *
	 * @param array $obj_array Array of chapter, specimen, label, perspective, item objs
	 * @return array Array of created or updated DBObjects
	 * @access public
	 */
	public function saveObjCollection($obj_array, $type=NULL)
	{
		return array_map(
			function($obj) use ($type) {return $this->saveObject($obj, $type);}, 
			$obj_array);
	}

	/**
	 * Deletes data from an array of DBObject chapter, specimen, label, perspective, or
	 * item objects from SQL database.
	 *
	 * @param array $obj_array Array of chapter, specimen, label, perspective, item objs
	 * @return integer Number of affected database rows
	 * @access public
	 */
	public function deleteObjCollection($obj_array, $type=NULL)
	{
		if (!$type) { 
			if ($this->numberObjClasses($obj_array) != 1) {
				die('Number of object classes not 1'); // Better error later
			}
			$type = get_class($obj_array[0]); 
		}

		$this->validateObjClass($type);

		$obj_ids = [];
		foreach ($obj_array as $obj) {
			$obj_ids[] = $obj->data['id'];
		}

		if (count($obj_ids) == 0) {
			return 0;
		} else {
			return $this->DB->delete($type, $obj_ids);
		}

		
	}
}

?>