<?php

include_once 'class/DB.class.php';
include_once 'class/DBObjectManager.class.php';

function validatePost($post)
{
	$valid_modes = ['save', 'delete'];
	$mode = strtolower($post['mode']);
	if ($mode != 'save' && $mode != 'delete') {
		die('Invalid mode'); // Better error later
	}

	$valid_types = ['Chapter', 'Specimen', 'Perspective', 'Label', 'Item'];
	if (!in_array($post['type'], $valid_types)) {
		die('Type not valid'); // Better error later
	}

	if ($post['sub_layer'] && $post['type'] == 'Item') {
		die('Item can not have sub-layer'); // Better error later 
	}
}

function subLayer($type)
{
	$valid_types = ['Chapter', 'Specimen', 'Perspective'];
	$sub_types = ['Specimen', 'Perspective', 'Label'];
	if (!in_array($type, $valid_types)) {
		return -1;
	}
	return $sub_types[array_search($type, $valid_types)];
}

function obj_data_column($obj_array, $var) {
	$data_column = array_column($obj_array, 'data');
	return array_column($data_column, $var);
}

function hasID($obj) {
	if (isset($obj->data['id'])) { return TRUE; } else { return FALSE; }
}

function recursiveDelete($obj=NULL, $DBObjManager, $type=NULL, $count=0) {
	if (gettype($obj) == 'array') {
		foreach ($obj as $member) {
				if (hasID($member) == false) { return 0; }
			}	
	} else {
		if (hasID($obj) == false) { return 0; }
		$obj = [$obj];
	}
		
	// Final loop condition
	if ($type == 'Label') {
		// Get item_id array from label $obj array
		$item_id = obj_data_column($obj, 'item_id');

		// Get count of numbers of label objs matching item_ids
		$item_id_counts = $DBObjManager->countDBObject('Label', 'item_id', 
			['item_id', 'in', $item_id]);
		
		
		// Get list of item_id where count=1 for deletion
		$item_id = array_column($item_id_counts, 'item_id');
		$counts = array_column($item_id_counts, 'COUNT(*)');
		$combined = array_combine($item_id, $counts);
		$trash_item_ids = array_keys($combined, $search_value = 1);

		// Delete label objects
		$count += $DBObjManager->deleteObjCollection($obj, $type);
		
		if (count($trash_item_ids) > 0) {
			// Delete all perspective_item entries where item_id in item_id list
			$trash_perspective_item = $DBObjManager->readObjCollection('Perspective_Item', 
				['item_id', 'in', $trash_item_ids]);
			$count += $DBObjManager->deleteObjCollection($trash_perspective_item);

			// Delete all items where id in item_id list
			$trash_items = $DBObjManager->readObjCollection('Item', 
				['id', 'in', $trash_item_ids]);
			$count += $DBObjManager->deleteObjCollection($trash_items);
		}
		
		return $count;
	}

	$id = obj_data_column($obj, 'id');
	$count += $DBObjManager->deleteObjCollection($obj, $type);
	$sub_type = subLayer($type);
	$obj_id_field = strtolower($type)."_id";
	$sub_obj = $DBObjManager->readObjCollection($sub_type, 
		[$obj_id_field, 'in', $id]);

	if (count($sub_obj) > 0) {
		recursiveDelete($sub_obj, $DBObjManager, $sub_type, $count);
	} else {
		return $count;
	}
}

function assignLabelItem($label, $item, $persp_id, $DBObjManager) {
	$label->data['item_id'] = $item->data['id'];
	$v_i = $DBObjManager->readObjCollection('Perspective_Item',
		['item_id', 'in', $item->data['id']]);
	$v_id_array = obj_data_column($v_i, 'perspective_id');
	if (!in_array($persp_id, $v_id_array)) {
		$new_v_i = new Perspective_Item(['perspective_id' => $persp_id, 
			'item_id' => $item->data['id']]);
		$DBObjManager->saveObject($new_v_i, 'Perspective_Item');
	}
	return $label;
}

function createItem($label, $persp_id, $DBObjManager) {
	$new_item = new Item(['name' => $label->data['name']]);
	$item = $DBObjManager->saveObject($new_item, 'Item');
	$label->data['item_id'] = $item->data['id'];
	$new_perspective_item = new Perspective_Item(['perspective_id' => $persp_id, 
		'item_id' => $item->data['id']]);
	$DBObjManager->saveObject($new_perspective_item, 'Perspective_Item');
	return $label;
}

function checkLabelItem($obj, $DBObjManager) {
	foreach ($obj->data['labels'] as $key => $label) {
		if (!$label->data['id']) {
			$label->data['perspective_id'] = $obj->data['id']; 
			$item = $DBObjManager->readObjCollection(
				'Item', ['name', '=', $label->data['name']]);
			if (count($item) > 1) {
				die('Two items with the same name, please check.');
			} elseif (count($item) == 1) {
				$obj->data['labels'][$key] = assignLabelItem($label, $item[0], 
					$obj->data['id'], $DBObjManager);
				//$obj = assignLabelItem($obj);
			} elseif (count($item) == 0) {
				$obj->data['labels'][$key] = createItem($label, 
					$obj->data['id'], $DBObjManager);
				//$obj = createItem($obj);		
			}
		}
	}
	return $obj;
}

function save($post, $DBObjManager)
{
	$return = [];
	foreach ($post['obj'] as $obj) {
		$r_obj = $DBObjManager->saveObject($obj, $post['type']);
		if ($post['sub_layer']) {
			$sub = subLayer($post['type']);
			$sub_array = strtolower($sub)."s";
			if ($sub == 'Label') {
				$obj = checkLabelItem($obj, $DBObjManager);
			}
			$sub_obj = $DBObjManager->saveObjCollection(
				$obj->data[$sub_array], $sub);
			$r_obj->data[$sub_array] = $sub_obj;
		}
		$return[] = $r_obj;
	}
	header('Content-Type: application/json');
	echo json_encode($return);
}

function delete($post, $DBObjManager)
{
	$count = 0;
	foreach ($post['obj'] as $obj) {
		$count += recursiveDelete($obj, $DBObjManager, $post['type']);
	}
	header('Content-Type: application/json');
	echo json_encode($count);
}

function dataObjToArray($obj, $type)
{
	$obj->data = (Array)$obj->data;
	$sub_type = subLayer($type);
	$sub_array_str = strtolower($sub_type)."s";
	if (isset($obj->data[$sub_array_str]) && 
		count($obj->data[$sub_array_str]) > 0) {
		foreach ($obj->data[$sub_array_str] as $sub_obj) {
			$sub_obj = dataObjToArray($sub_obj, $sub_type);
		}
	}
	return $obj;
}

$DB = new DB();
$DBObjManager = new DBObjectManager($DB);

$data = json_decode(file_get_contents('php://input'));

$post = array();

$post['mode'] = $_GET['mode'] ?? NULL;
$post['type'] = $_GET['type'] ?? NULL;
$post['sub_layer'] = $_GET['sub_layer'] ?? FALSE;
$post['obj'] = $data->obj ?? NULL;

if (gettype($post['obj']) != 'array') { $post['obj'] = [$post['obj']]; }

foreach ($post['obj'] as $obj) {
	$obj = dataObjToArray($obj, $post['type']);
}

if (strtolower($post['mode']) == 'save') {
	save($post, $DBObjManager);
} elseif (strtolower($post['mode']) == 'delete') {
	delete($post, $DBObjManager);
}

?>