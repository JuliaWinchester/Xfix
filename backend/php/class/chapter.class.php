<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "chapter" object, describing a chapter or chapter 
* that can be associated with one or more anatomical specimens. Inherits from 
* DBObject and should be created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Chapter extends DBObject
{
	// Inherited variables: protected $db_row, $data; public $tiers

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	protected function unpackData()
	{
		$this->data['id'] = $this->db_row['id'] ?? NULL;
		$this->data['name'] = $this->db_row['name'] ?? NULL;
		$this->data['number'] = $this->db_row['number'] ?? NULL;
		$this->data['specimens'] = [];
		$this->data['save_fields'] = array('name', 'number');
	}
}

?>