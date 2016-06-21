<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "view" object, describing an image view of an
* anatomical model. This object is associated with one anatomical model object,
* and can be associated with one or more label objects representing graphical
* labels of anatomical structures and one or more item objects representing 
* labelled structures. Inherits from DBObject and should be created by 
* DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class View extends DBObject
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
		$this->data['type'] = isset($this->db_row['type']) ?? NULL;
		$this->data['image'] = isset($this->db_row['image']) ?? NULL;
		$this->data['image_scaled'] = isset($this->db_row['image_scaled']) ?? NULL;
		$this->data['image_flat'] = isset($this->db_row['image_flat']) ?? NULL;
		$this->data['image_thumb'] = isset($this->db_row['image_thumb']) ?? NULL;
		$this->data['scale'] = isset($this->db_row['scale']) ?? NULL;
		$this->data['position_x'] = isset($this->db_row['position_x']) ?? NULL;
		$this->data['position_y'] = isset($this->db_row['position_y']) ?? NULL;
		$this->data['model_id'] = isset($this->db_row['model_id']) ?? NULL;
		$this->data['labels'] = [];
		$this->data['items'] = [];
		$this->data['save_fields'] = array('type', 'image', 'image_scaled', 
			'image_flat', 'image_thumb', 'scale', 'position_x', 'position_y',
			'model_id');
	}
}

?>