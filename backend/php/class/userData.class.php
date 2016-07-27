<?php

class UserData 
{
	protected $users_list = ['student' => '$2y$10$O8USTKIQrpwenr5vB55uauI3U9dUcmlK/pY4V4Q4GCJ0.st36/1Ve',
		'administrator' => '$2y$10$wwaAJX/8he4DhR.PyShVaOSPQkXiorDy56S6.CEQkKmpQlV5fwAci'];

	public function verifyUserPass($user, $pass) 
	{
		foreach ($this->users_list as $user => $hash) {
			if (password_verify($user.':'.$pass, $hash) == true) {
				return $user;
			}
		}
		return false;
	}	
}

?>