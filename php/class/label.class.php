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
	// Inherited variables: public $id, $data, $datafields
	public $name;
	public $label_position_x;
	public $label_position_y;
	public $arrow_position_x;
	public $arrow_position_y;
	public $font_family;
	public $font_weight;
	public $color;
	public $view_id;
	public $item_id;

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	function unpackdata()
	{
		$this->id = $this->data['id'];
		$this->name = $this->data['name'];
		$this->label_position_x = $this->data['label_position_x'];
		$this->label_position_y = $this->data['label_position_y'];
		$this->arrow_position_x = $this->data['arrow_position_x'];
		$this->arrow_position_y = $this->data['arrow_position_y'];
		$this->font_family = $this->data['font_family'];
		$this->font_weight = $this->data['font_weight'];
		$this->color = $this->data['color'];
		$this->view_id = $this->data['view_id'];
		$this->item_id = $this->data['item_id'];
		$this->datafields = ['id', 'name', 'label_position_x', 
			'label_position_y', 'arrow_position_x', 'arrow_position_y',
			'font_family', 'font_weight', 'color', 'view_id', 'item_id'];
	}
}

?>