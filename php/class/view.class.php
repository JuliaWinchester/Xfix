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
		$this->data['id'] = $this->db_row['id'];
		$this->data['type'] = $this->db_row['type'];
		$this->data['image'] = $this->db_row['image'];
		$this->data['image_scaled'] = $this->db_row['image_scaled'];
		$this->data['image_flat'] = $this->db_row['image_flat'];
		$this->data['image_thumb'] = $this->db_row['image_thumb'];
		$this->data['scale'] = $this->db_row['scale'];
		$this->data['position_x'] = $this->db_row['position_x'];
		$this->data['position_y'] = $this->db_row['position_y'];
		$this->data['model_id'] = $this->db_row['model_id'];
		$this->data['labels'] = [];
		$this->data['items'] = [];
		$this->data['save_fields'] = array('type', 'image', 'image_scaled', 
			'image_flat', 'image_thumb', 'scale', 'position_x', 'position_y',
			'model_id');
	}
}

?>