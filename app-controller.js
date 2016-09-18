angular.module('app').controller('AppController', AppController);

AppController.$inject = ['$scope', '$route', 'LogInService', '$location', '$timeout'];

function AppController($scope, $route, LogInService, $location, $timeout) {
	$scope.$on('user.update', function(event) {
        $scope.user = LogInService.currentUser;
  	});

	$scope.$route = $route;
	LogInService.redirectIfNoUser();
	if (LogInService.getUser() !== false) {
		$scope.user = LogInService.getUser();
	}

	$scope.username = "";
	$scope.password = "";

	$scope.homelink = function () {
		if (LogInService.getUser() !== false) {
			console.log('redirecting');
			$location.path('/');
		}
	};

	$scope.login = function () {
		if ($scope.username && $scope.password) {
			LogInService.login($scope.username, $scope.password).then(
				function (result) {
					if (result === true) {
						$location.path('/');
					} else {
						console.log('Incorrect username or password');
					}
				});
			$scope.username = "";
			$scope.password = "";
		}
	};

	$scope.logout = function () {
		LogInService.logout();
		$location.path('/login');
		$scope.username = "";
		$scope.password = "";
	};
}