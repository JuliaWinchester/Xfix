<?php

include_once 'dbObject.class.php';

/**    
* Class for Xfix database "label" object, describing a graphical label of a 
* structure from an anatomical specimen, associated with one perspective object
* representing an anatomical specimen image and with one item object representing
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
		$this->data['id'] = isset($this->db_row['id']) ? $this->db_row['id'] : NULL;
		$this->data['name'] = isset($this->db_row['name']) ? $this->db_row['name'] : NULL;
		$this->data['label_position_x'] = isset($this->db_row['label_position_x']) ? $this->db_row['label_position_x'] : NULL;
		$this->data['label_position_y'] = isset($this->db_row['label_position_y']) ? $this->db_row['label_position_y'] : NULL;
		$this->data['arrow_position_x'] = isset($this->db_row['arrow_position_x']) ? $this->db_row['arrow_position_x'] : NULL;
		$this->data['arrow_position_y'] = isset($this->db_row['arrow_position_y']) ? $this->db_row['arrow_position_y'] : NULL;
		$this->data['font_family'] = isset($this->db_row['font_family']) ? $this->db_row['font_family'] : NULL;
		$this->data['font_weight'] = isset($this->db_row['font_weight']) ? $this->db_row['font_weight'] : NULL;
		$this->data['color'] = isset($this->db_row['color']) ? $this->db_row['color'] : NULL;
		$this->data['perspective_id'] = isset($this->db_row['perspective_id']) ? $this->db_row['perspective_id'] : NULL;
		$this->data['item_id'] = isset($this->db_row['item_id']) ? $this->db_row['item_id'] : NULL;
		$this->data['save_fields'] = array('name', 'label_position_x', 
			'label_position_y', 'arrow_position_x', 'arrow_position_y',
			'font_family', 'font_weight', 'color', 'perspective_id', 'item_id');
	}
}

?>