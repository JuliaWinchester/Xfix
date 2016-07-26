angular.module('app').controller('LogInController', LogInController);

LogInController.$inject = ['$scope', 'LogInService', '$rootScope'];

function LogInController($scope, LogInService, $rootScope) {
	$scope.title = "ANP 300 > Log In";
	if (LogInService.getUser()) {
		$scope.user = LogInService.getUser();
	} else {
		$scope.user = "";
	}

	$scope.username = "";
	$scope.password = "";

	$scope.login = function () {
		var success = LogInService.login($scope.username, $scope.password);
		if (success) {
			console.log($rootScope);
		} else {
			console.log('Incorrect username or password');
		}
	};
}