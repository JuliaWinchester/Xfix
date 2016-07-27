<?php

include_once 'class/userData.class.php';

$userData = new UserData();
$data = json_decode(file_get_contents('php://input'));
$result = $userData->verifyUserPass($data->user, $data->pass);
header('Content-Type: application/json');
echo json_encode($result);	

?>