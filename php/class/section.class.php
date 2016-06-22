<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "section" object, describing a section or chapter 
* that can be associated with one or more anatomical models. Inherits from 
* DBObject and should be created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Section extends DBObject
{
	// Inherited variables: protected $db_row, $data; public $tiers

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	protected function unpackData()
	{
		$this->data['id'] = isset($this->db_row['id']) ?? NULL;
		$this->data['name'] = isset($this->db_row['name']) ?? NULL;
		$this->data['models'] = [];
		$this->data['save_fields'] = array('name');
	}
}

?>