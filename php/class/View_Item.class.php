<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "view_item" object, describing a relationship between 
* a graphical view of an anatomical model with a structure item identified in
* that model. Inherits from DBObject and should be created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Section extends DBObject
{
	// Inherited variables: protected $db_row; public $data, $tiers

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	protected function unpackData()
	{
		$this->data['id'] = isset($this->db_row['id']) ?? NULL;
		$this->data['view_id'] = isset($this->db_row['view_id']) ?? NULL;
		$this->data['item_id'] = isset($this->db_row['item_id']) ?? NULL;
		$this->data['save_fields'] = array('view_id', 'item_id');
	}
}

?>