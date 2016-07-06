<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "perspective_item" object, describing a relationship between 
* a graphical perspective of an anatomical specimen with a structure item identified in
* that specimen. Inherits from DBObject and should be created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Perspective_Item extends DBObject
{
	// Inherited variables: protected $db_row; public $data, $tiers

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	protected function unpackData()
	{
		$this->data['id'] = $this->db_row['id'] ?? NULL;
		$this->data['perspective_id'] = $this->db_row['perspective_id'] ?? NULL;
		$this->data['item_id'] = $this->db_row['item_id'] ?? NULL;
		$this->data['save_fields'] = array('perspective_id', 'item_id');
	}
}

?>