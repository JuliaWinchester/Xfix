<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "model" object, describing an anatomical model  
* that is associated with one topical section object and can be associated with 
* one or more view objects of that model. Inherits from DBObject and should be 
* created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Model extends DBObject
{
	// Inherited variables: protected $db_row, $data; public $tiers

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	protected function unpackData()
	{
		$this->data['id'] = $this->db_row['id'];
		$this->data['name'] = $this->db_row['name'];
		$this->data['type'] = $this->db_row['type'];
		$this->data['description'] = $this->db_row['description'];
		$this->data['section_id'] = $this->db_row['section_id'];
		$this->data['views'] = []];
	}
}

?>