<?php

include_once('class/DB.class.php');
include_once('class/DBObjectManager.class.php');

function validatePost($post)
{
	$valid_modes = ['save', 'delete'];
	$mode = strtolower($post['mode']);
	if ($mode != 'save' && $mode != 'delete') {
		die('Invalid mode'); // Better error later
	}

	$valid_types = ['Section', 'Model', 'View', 'Label', 'Item'];
	if (!in_array($req['type'], $valid_types)) {
		die('Type not valid'); // Better error later
	}

	if ($req['sub_layer'] && $req['type'] == 'Item') {
		die('Item can not have sub-layer'); // Better error later 
	}
}

function subLayer($type)
{
	$valid_types = ['Section', 'Model', 'View', 'Label'];
	if (!in_array($type), $valid_types) {
		die('No valid sub-layer type'); // Better error later
	}
	return $valid_types[array_search($type, $valid_types)+1];
}

function obj_data_column($obj_array, $var) {
	$data_column = array_column($obj_array, 'data');
	return array_column($data_column, $var);
}

function recursiveDelete($obj=NULL, $type=NULL) {
	// Final loop condition
	if ($type == 'Label') {
		// Get item_id array from label $obj array
		if (gettype($obj) == 'array') {
			$item_id = obj_data_column($obj, 'item_id');
		} else {
			$item_id = $obj->data['item_id'];
			$obj = [$obj];
		}

		// Get count of numbers of label objs matching item_ids
		$item_id_counts = $DBObjManager->countDBObject('Item', 'item_id', 
			['item_id', 'IN', $item_id]);
		
		// Get list of item_id where count=1 for deletion
		$item_id = array_column($item_id_counts, 'item_id');
		$counts = array_column($item_id_counts, 'count(*)');
		$combined = array_combine($item_id, $counts);
		$trash_item_ids = array_keys($combined, $search_value = 1);

		// Delete label objects
		$DBObjManager->deleteObjCollection($obj, $type);
		
		// Delete all items where id in item_id list
		$trash_items = $DBObjManager->readObjCollection('item', 
			['id', 'IN', $trash_item_ids]);
		$DBObjManager->deleteObjCollection($trash_items);
		// Delete all view_item entries where item_id in item_id list
		$trash_view_item = $DBObjManager->readObjCollection('view_item', 
			['item_id', 'IN', $trash_item_ids]);
		$DBObjManager->deleteObjCollection($trash_view_item);

		return TRUE;
	}

	if (gettype($obj) == 'array') {
		$id = obj_data_column($obj, 'id');
	} else {
		$id = $obj->data['id'];
		$obj = [$obj];
	}

	$DBObjManager->deleteObjCollection($obj, $type);
	$sub_type = subLayer($type);
	$obj_id_field = strtolower($type)."_id";
	$sub_obj = $DBObjManager->readObjCollection($sub_type, 
		[$obj_id_field, 'IN', $id]);
	recursiveDelete($sub_obj, $sub_type);
}

function save($post)
{
	$return = [];
	foreach ($post['obj'] as $key => $obj) {
		$r_obj = $DBObjManager->saveObject($obj, $post['type']);
		if ($post['sub_layer']) {
			$sub = subLayer($post['type']);
			$sub_array = strtolower($sub)."s";
			$sub_obj = $DBObjManager->saveObjCollection($obj[$sub_array], $sub);
			$r_obj[$sub_array] = $sub_obj;
		}
		$return[] = $r_obj;
	}
	header('Content-Type: application/json');
	echo json_encode($return);
}

function delete($post)
{
	$return = [];
	foreach ($post['obj'] as $key => $obj) {

	}
}

$DB = new DB();
$DBObjManager = new DBObjectManager($DB);

$data = json_decode(file_get_contents('php://input'));

$post['mode'] = isset($data->mode) ?? NULL;
$post['type'] = isset($data->type) ?? NULL;
$post['sub_layer'] = isset($data->sub_layer) ?? NULL;
$post['obj'] = isset($data->obj) ?? NULL;

validatePost($post);

if (strtolower($post['mode']) == 'save') {
	save($post);
} elseif (strtolower($post['mode']) == 'delete') {
	delete($post);
}

?>