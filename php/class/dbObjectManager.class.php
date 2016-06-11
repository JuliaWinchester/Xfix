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
class DBObjectManager
{
	// Static method, returns an array of DBObjects 
	public static function getCollection($DB, $where=false)
	{
		$collection = [];
		$results = $DB->read(get_class($this), $where);
		foreach ($results as $r) {
			$collection[] = new get_class($this)($DB, $r);
		}
		return $collection;
	}

	// Static method, returns a single DBObject
	public static function getObj($DB, $id)
	{
		$result = $DB->read(get_class($this), 'WHERE id = $id');
		return new get_class($this)($DB, $result);
	}

		// Saves object data as either a new row or updates a prior row
	function save($new=false) {
		$column = $this->datafields;
		$value = array_map(function($x) { return $this->data[$x]; }, $this->datafields);

		if (!$new) {
			return $this->dbh->update(get_class($this), $column, $value, $this->id);
		} else {
			return $this->dbh->create(get_class($this), $column, $value)
		}
	}

	// Deletes object data from database
	function delete() {
		$this->dbh->delete(get_class($this), $this->id);
		return true;
	}
}
?>