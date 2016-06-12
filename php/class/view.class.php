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
	// Inherited variables: public $id, $data, $datafields
	public $type;
	public $image;
	public $image_scaled;
	public $image_flat;
	public $image_thumb;
	public $scale;
	public $position_x;
	public $position_y;
	public $model_id;
	public $labels; // Array of label objects
	public $items; // Array of item objects

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	function unpackdata()
	{
		$this->id = $this->data['id'];
		$this->type = $this->data['type'];
		$this->image = $this->data['image'];
		$this->image_scaled = $this->data['image_scaled'];
		$this->image_flat = $this->data['image_flat'];
		$this->image_thumb = $this->data['image_thumb'];
		$this->scale = $this->data['scale'];
		$this->position_x = $this->data['position_x'];
		$this->position_y = $this->data['position_y'];
		$this->model_id = $this->data['model_id'];
		$this->datafields = ['id', 'type', 'image', 'image_scaled', 'image_flat',
							 'image_thumb', 'scale', 'position_x', 'position_y', 
							 'model_id'];
		$this->$labels = [];
		$this->$items = [];
	}
}

?>