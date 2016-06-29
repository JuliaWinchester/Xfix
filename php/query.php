<?php

include_once('class/DB.class.php');
include_once('class/DBObjectManager.class.php');

function validateReq($req)
{
	$valid_types = ['Section', 'Model', 'View', 'Label', 'Item'];
	if (!in_array($req['type'], $valid_types)) {
		die('Type not valid:'.var_dump($req)); // Better error later
	}
	if ($req['sub_layer'] && $req['type'] == 'Item') {
		die('Item can not have sub-layer'); // Better error later 
	}
	if ($req['id'] && $req['match_view_id']) {
		die('id and match_view_id both present'); // Error later
	}

	if ($req['type'] == 'Model' && $req['match_view_id'] && !$req['sub_layer']) {
		echo "Warning: View-matched models always include view sub-layers";
		$req['sub_layer'] = TRUE;
	}	
}

function subLayer($type)
{
	$valid_types = ['Section', 'Model', 'View', 'Label'];
	if (!in_array($type, $valid_types)) {
		die('No valid sub-layer type'); // Better error later
	}
	return $valid_types[array_search($type, $valid_types)+1];
}

$DB = new DB();
$DBObjManager = new DBObjectManager($DB);

$req = array();

$req['type'] = $_GET['type'] ?? NULL;
$req['sub_layer'] = $_GET['sub_layer'] ?? FALSE;
$req['id'] = $_GET['id'] ?? NULL;
$req['match_view_id'] = $_GET['match_view_id'] ?? NULL;

validateReq($req);

if ($req['id']) {
	$obj = $DBObjManager->readObject($req['type'], $req['id']);
} elseif ($req['match_view_id']) {
	$obj = $DBObjManager->readObjCollection($req['type'], NULL, 
		$req['match_view_id']);
} else {
	$obj = $DBObjManager->readObjCollection($req['type']);
}

if ($req['sub_layer']) {
	if ($req['id']) {
		$sub_where = [strtolower($req['type'])."_id", "=", $req['id']];
	} else {
		$sub_where = NULL;
	}
	$sub_type = subLayer($req['type']);
	$sub_objs = $DBObjManager->readObjCollection($sub_type, $sub_where);
	$obj = $obj[0]->mergeObjects($obj, $sub_objs);
}

header('Content-Type: application/json');
echo json_encode(array_values($obj));	

?>