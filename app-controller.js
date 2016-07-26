angular.module('app').controller('AppController', AppController);

AppController.$inject = ['$scope', '$route', 'LogInService', '$location', '$timeout'];

function AppController($scope, $route, LogInService, $location, $timeout) {
	$scope.$on('user.update', function(event) {
        $scope.user = LogInService.currentUser;
  	});

	$scope.$route = $route;
	LogInService.getUser();
	$scope.user = LogInService.currentUser;
	if ($scope.user) {
		$location.path('/');
	}

	$scope.title = "ANP 300 > Log In";

	$scope.username = "";
	$scope.password = "";

	$scope.login = function () {
		if ($scope.username && $scope.password) {
			if (LogInService.login($scope.username, $scope.password)) {
				$location.path('/');
			} else {
				console.log('Incorrect username or password');
			}
			$scope.username = "";
			$scope.password = "";
		}
	};

	$scope.logout = function () {
		LogInService.logout();
		$location.path('/login');
	};
}