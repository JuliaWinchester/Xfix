<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "item" object, describing an anatomical structure. 
* Label objects representing graphical labels of anatomical structures can be
* associated with item objects via the label object's item_id variable, and   
* view objects representing image views of anatomical models can incorporate one
* or more item objects. Inherits from DBObject and should be 
* created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Item extends DBObject
{
	// Inherited variables: public $id, $data, $datafields
	public $name;

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	function unpackdata()
	{
		$this->id = $this->data['id'];
		$this->name = $this->data['name'];
		$this->datafields = ['id', 'name'];
	}
}

?>