<?php

include_once 'DBObject.class.php';

/**    
* Class for Xfix database "section" object, describing a section or chapter 
* that can be associated with one or more anatomical models. Inherits from 
* DBObject and should be created by DBObjectManager.
* 
* @package Xfix
* @author Julie Winchester <julie.m.winchester@gmail.com>
* @access public    
*/
class Section extends DBObject
{
	// Inherited variables: public $id, $data, $datafields
	public $name;
	public $models;

	/**
	* Unpacks database row array and sorts values into variables as appropriate. 
	*
	* @access public 
	*/
	function unpackdata()
	{
		$this->id = $this->data['id'];
		$this->name = $this->data['name'];
		$this->datafields = ['id', 'name'];
		$this->$models = [];
	}
}

?>