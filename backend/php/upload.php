<?php

if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {

	$result = [];
	$temp = explode('.', $_FILES['file']['name']);
	$new_file_name = substr(md5(time()), 0, 10).'.'.end($temp);
	move_uploaded_file($_FILES['file']['tmp_name'], 
		'../../assets/images/'.$new_file_name);
	$result['file_uploaded'] = $new_file_name;

	if (isset($_GET['old_image'])) {
		$delete_success = unlink('../../'.$_GET['old_image']);
		$result['old_image_del'] = $delete_success;
	}

	echo json_encode($result);
}

?>