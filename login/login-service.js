angular.module('app').service('LogInService', LogInService);

LogInService.$inject = ['$cookies', '$rootScope', '$location'];

function LogInService($cookies, $rootScope, $location) {
	var service = {
		currentUser: '',
		userArray: ['student:zygapophysis', 'administrator:glomerulus'],
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
			if (service.userArray.indexOf(user+':'+pass) > -1) {
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
		logout: function () {
			$rootScope.globals = {};
			$cookies.remove('globals');
			service.currentUser = '';
			$rootScope.$broadcast('user.update');
		},
	};
	return service;
}