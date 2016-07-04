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
	if (!in_array($post['type'], $valid_types)) {
		die('Type not valid'); // Better error later
	}

	if ($post['sub_layer'] && $post['type'] == 'Item') {
		die('Item can not have sub-layer'); // Better error later 
	}
}

function subLayer($type)
{
	$valid_types = ['Section', 'Model', 'View'];
	$sub_types = ['Model', 'View', 'Label'];
	if (!in_array($type, $valid_types)) {
		return -1;
	}
	return $sub_types[array_search($type, $valid_types)];
}

function obj_data_column($obj_array, $var) {
	$data_column = array_column($obj_array, 'data');
	return array_column($data_column, $var);
}

function recursiveDelete($obj=NULL, $DBObjManager, $type=NULL, $count=0) {
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
		$count += $DBObjManager->deleteObjCollection($obj, $type);
		
		// Delete all items where id in item_id list
		$trash_items = $DBObjManager->readObjCollection('Item', 
			['id', 'IN', $trash_item_ids]);
		$count += $DBObjManager->deleteObjCollection($trash_items);
		// Delete all view_item entries where item_id in item_id list
		$trash_view_item = $DBObjManager->readObjCollection('View_Item', 
			['item_id', 'IN', $trash_item_ids]);
		$count += $DBObjManager->deleteObjCollection($trash_view_item);

		return $count;
	}

	if (gettype($obj) == 'array') {
		$id = obj_data_column($obj, 'id');
	} else {
		$id = $obj->data['id'];
		$obj = [$obj];
	}

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

function save($post, $DBObjManager)
{
	$return = [];
	foreach ($post['obj'] as $obj) {
		$r_obj = $DBObjManager->saveObject($obj, $post['type']);
		if ($post['sub_layer']) {
			die('sub_layer triggered');
			$sub = subLayer($post['type']);
			$sub_array = strtolower($sub)."s";
			if ($sub == 'Label') {
				foreach ($obj->data[$sub_array] as $label) {
					if (!$label->data['id']) {
						$item = $DBObjManager->readObjCollection(
							'Item', ['name', '=', $label->data['name']]);
						if (count($item) > 1) {
							die('Two items with the same name, please check.');
						} elseif (count($item) == 1) {
							$label->data['item_id'] = $item[0]->data['id'];
							$v_i = $DBObjManager->readObjCollection('View_Item',
								['item_id', 'IN', $item[0]->data['id']]);
							$v_id_array = obj_data_column($v_i, 'view_id');
							if (!in_array($obj->data['id'], $v_id_array)) {
								$new_v_i = ['view_id' => $obj->data['id'], 
									'item_id' => $item[0]->data['id'], 'save_fields' =>
									['view_id', 'item_id']];
								$DBObjManager->saveObject($new_v_i, 'View_Item');
							}
						} elseif (count($item) == 0) {
							$new_item = ['name' => $label->data['name'], 
								'save_fields' => ['name']];
							$item = $DBObjManager->saveObject($new_item, 'Item');
							$label->data['item_id'] = $item->data['id'];
							$new_view_item = ['view_id' => $obj->data['id'],
								'item_id' => $item->data['id'], 'save_fields' =>
								['view_id', 'item_id']];
							$DBObjManager->saveObject($new_view_item, 'View_Item');
						}
					}
				}
			}
			$sub_obj = $DBObjManager->saveObjCollection(
				$obj->data[$sub_array], $sub);
			$r_obj[$sub_array] = $sub_obj;
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