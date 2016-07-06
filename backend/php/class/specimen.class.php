<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "specimen" object, describing an anatomical specimen  
* that is associated with one topical chapter object and can be associated with 
* one or more perspective objects of that specimen. Inherits from DBObject and should be 
* created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Specimen extends DBObject
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
		$this->data['type'] = $this->db_row['type'] ?? NULL;
		$this->data['description'] = $this->db_row['description'] ?? NULL;
		$this->data['chapter_id'] = $this->db_row['chapter_id'] ?? NULL;
		$this->data['perspectives'] = [];
		$this->data['save_fields'] = ['name', 'type', 'description', 
			'chapter_id'];
	}
}

?>