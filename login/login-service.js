angular.module('app').service('LogInService', LogInService);

LogInService.$inject = ['$cookies', '$rootScope', '$location', '$http'];

function LogInService($cookies, $rootScope, $location, $http) {
	var service = {
		currentUser: '',
		getUser: function () {
			if ($rootScope.globals && $rootScope.globals.hasOwnProperty("currentUser")) {
				service.currentUser = $rootScope.globals.currentUser.username;
				return service.currentUser;
			} else if ($cookies.getObject('globals')) {
				service.currentUser = $cookies.getObject('globals').currentUser.username;
				return service.currentUser;
			} else {
				console.log('No current user!');
				$location.path('/login');
			}
		},
		login: function (user, pass) {
			return $http.post('backend/php/user.php', {user: user, pass: pass}).
				then(function successCallback(response) {
					if (response.data == user) {
						$rootScope.globals = {
							currentUser: {
								username: user
							}
						};
						$cookies.putObject('globals', $rootScope.globals);
						service.currentUser = user;
						$rootScope.$broadcast('user.update');
						return true;		
					} else {
						return false;
					}
				},
				function errorCallback(response) {
					console.log('HTTP post error');
					console.log(response);
				});
		},
		logout: function () {
			$rootScope.globals = {};
			$cookies.remove('globals');
			service.currentUser = '';
			$rootScope.$broadcast('user.update');
		},
	};
	return service;
}