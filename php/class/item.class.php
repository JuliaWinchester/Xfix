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
	// Inherited variables: protected $db_row, $data; public $tiers

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access protected 
	*/
	protected function unpackData()
	{
		$this->data['id'] = isset($this->db_row['id']) ?? NULL;
		$this->data['name'] = isset($this->db_row['name']) ?? NULL;
		$this->data['save_fields'] = array('name');
	}
}

?>