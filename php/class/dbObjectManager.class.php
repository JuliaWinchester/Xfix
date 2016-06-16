<?php

/**    
* DBObjectManager constructs and manages database operations for DBObject child 
* class objects (sections, models, views, labels, items). This class acts as a
* factory generating DBObjects and provides a DBObject-specific interface
* for database create, read, update, and delete functionality. 
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/

include_once 'Section.class.php';
include_once 'Model.class.php';
include_once 'View.class.php';
include_once 'Label.class.php';
include_once 'Item.class.php';

class DBObjectManager
{
	protected DB;

	function __construct($DB)
	{
		$this->DB = $DB;
	}

	function flattenArray($a)
	{
		return call_user_func_array('array_merge', 
									array_map('array_values', $a));
	}

	############################################################################
	# Methods for single DBObjects
	############################################################################

	/**
	 * Reads a database row corresponding to the $obj_class type with a primary
	 * key ID $id and returns an appropriate $obj_class object. 
	 *
	 * @param string $obj_class One of ['section','model','view','label','item']
	 * @param integer $id Primary key ID of database row for object
	 * @return DBObject Section, model, view, label, or item object
	 * @access public
	 */
	function readObject($obj_class, $id)
	{
		$obj_types = ['Section','Model','View','Label','Item'];
		if (!in_array($obj_class, $obj_types)) {
			return FALSE; // Error later
		}
		$db_row = $this->DB.read(strtolower($obj_class),['id','=',$id])[0];
		return new $obj_class($db_row);
	}

	/**
	 * Saves data from a DBObject section, model, label, view, or item object
	 * to SQL database by either creating a new entry or updating a previous
	 * entry.
	 *
	 * @param DBObject $obj Section, model, label, view, or item object
	 * @param bool $new Whether object to be saved is new or not
	 * @return integer Number of affected database rows (should be 1)
	 * @access public
	 */
	function saveObject($obj, $new=T)
	{

	}

	/**
	 * Deletes data from a DBObject section, model, label, view, or item object
	 * from SQL database.
	 *
	 * @param DBObject $obj Section, model, label, view, or item object
	 * @return integer Number of affected database rows (should be 1)
	 * @access public
	 */
	function deleteObject($obj)
	{
		return $this->DB->delete(strtolower(get_class($obj)), [$obj->id]);
	}

	############################################################################
	# Methods for collections of multiple DBObjects
	############################################################################

	function dbRowsToObjArray($obj_class, $db_rows)
	{
		$obj_array = [];
		foreach ($db_rows as $index => $data) {
			$obj_array[$data['id']] = new $obj_class($data);
		}
		return $obj_array;
	}

	function readMatchingCollectionModel($match_view_id)
	{
		$item_ids = $this->DB->read('view_item', 
									['view_id', '=', $match_view_id],'item_id');
		$view_ids = $this->DB->read('view_item', ['item_id', 'in', $item_ids], 
													'view_id', TRUE);

		$item_ids = $this->flattenArray($item_ids);
		$view_ids = $this->flattenArray($view_ids);

		$view_rows = $this->DB->read('view', ['id', 'in', $view_ids]);
		$view_objs = $this->dbRowsToObjArray('View', $view_rows);

		$model_ids = array_map(function($x) {return $x->data['model_id'];}, $view_objs);
		$model_ids = array_unique($model_ids);

		$model_rows = $this->DB->read('model',['id', 'in', $model_ids]);
		$model_objs = $this->dbRowsToObjArray('Model', $model_rows);

		$model_objs = $model_objs[0]->mergeObjects($model_objs, $view_objs);
		return $model_objs;
	}

	function readMatchingCollectionItem($match_view_id)
	{
		$db_rows = $this->DB->readInnerJoin('item', 'view_item', 'id', 
											'item_id', ['view_item.view_id','=',
											$match_view_id]);
		return $this->dbRowsToObjArray('Item', $db_rows);
	}

	function readMatchingCollection($obj_class, $match_view_id)
	{
		if ($obj_class == 'Model') {
			return $this->readMatchingCollectionModel($match_view_id);
		} elseif ($obj_class == 'Item') {
			return $this->readMatchingCollectionItem($match_view_id);
		} else {
			return FALSE; // Error later
		}
	}

	/**
	 * Reads multiple database rows corresponding to the $obj_class type with an
	 * optional where clause to specify results. Optional $match_view_id
	 * provides special functionality for item and model objects. When used to
	 * read item objects, method returns items that match a given view ID
	 * (i.e., all anatomical structures that appear in a given view). When used
	 * to read model objects, method returns models and associated views that
	 * share items in common with the given view ID (i.e., anatomical models and
	 * views of models that share an anatomical structure with a given view).
	 * Only one of optional parameters $where and $match_view_id should be used.
	 *
	 * @param string $obj_class One of ['Section','Model','View','Label','Item']
	 * @param array $where ['column', '=' OR 'in', 'value' OR ['a', 'b', ...]]
	 * @param integer $match_view_id View ID to match items and models to
	 * @return array Array of section, model, view, label, or item objects
	 * @access public
	 */
	function readObjCollection($obj_class, $where=NULL, $match_view_id=NULL)
	{
		$obj_types = ['Section','Model','View','Label','Item'];
		if (!in_array($obj_class, $obj_types)) {
			return FALSE; // Error later
		}

		if ($match_view_id) {
			if ($where) {
				return FALSE; // Error later
			}
			return $this->readMatchingCollection($obj_class, $match_view_id);
		}
		
		$db_rows = $this->DB.read(strtolower($obj_class),$where);
		return $this->dbRowsToObjArray($obj_class, $db_rows);
	}

	/**
	 * Saves data from a an array of DBObject section, model, label, view, or
	 * item objects to SQL database by either creating new entries or updating
	 * previous entries.
	 *
	 * @param array $obj_array Array of section, model, label, view, item objs
	 * @param array $new_bool_array Bool per object, T if new and F if not
	 * @return integer Number of affected database rows
	 * @access public
	 */
	function saveObjCollection($obj_array, $new_bool_array)
	{

	}

	/**
	 * Deletes data from an array of DBObject section, model, label, view, or
	 * item objects from SQL database.
	 *
	 * @param array $obj_array Array of section, model, label, view, item objs
	 * @return integer Number of affected database rows
	 * @access public
	 */
	function deleteObjCollection($obj_array)
	{
		$obj_types = array_map('get_class', $obj_array)
		if (count(array_unique($obj_types)) != 1) {
			return FALSE; // Error later
		}

		$obj_ids = []
		foreach ($obj_array as $index => $obj) {
			$obj_ids[] = $obj->data['id'];
		}

		return $this->DB->delete($obj_types[0], $obj_ids);
	}
}

?>