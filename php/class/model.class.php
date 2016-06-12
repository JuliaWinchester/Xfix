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
	// Inherited variables: public $id, $data, $datafields
	public $name;
	public $type;
	public $description;
	public $section_id;
	public $views;

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	function unpackdata()
	{
		$this->id = $this->data['id'];
		$this->name = $this->data['name'];
		$this->type = $this->data['type'];
		$this->description = $this->data['description'];
		$this->section_id = $this->data['section_id'];
		$this->datafields = ['id', 'name', 'type', 'description', 'section_id'];
		$this->views = [];
	}
}

?>