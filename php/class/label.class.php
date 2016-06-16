<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "label" object, describing a graphical label of a 
* structure from an anatomical model, associated with one view object
* representing an anatomical model image and with one item object representing
* the labeled structure. Inherits from DBObject and should be created by 
* DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Label extends DBObject
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
		$this->data['label_position_x'] = $this->db_row['label_position_x'];
		$this->data['label_position_y'] = $this->db_row['label_position_y'];
		$this->data['arrow_position_x'] = $this->db_row['arrow_position_x'];
		$this->data['arrow_position_y'] = $this->db_row['arrow_position_y'];
		$this->data['font_family'] = $this->db_row['font_family'];
		$this->data['font_weight'] = $this->db_row['font_weight'];
		$this->data['color'] = $this->db_row['color'];
		$this->data['view_id'] = $this->db_row['view_id'];
		$this->data['item_id'] = $this->db_row['item_id'];
	}
}

?>