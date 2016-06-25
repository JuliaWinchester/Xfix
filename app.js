var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/model/:modelId', {
			templateUrl: 'model/model.html',
			controller: 'modelController'
		})
		.when('/model/:modelId/view/:viewId', {
			templateUrl: 'view/view.html',
			controller: 'viewController'
		})
		.otherwise({
			templateUrl: 'section/section.html',
			controller: 'sectionController'
		});

		$locationProvider.html5Mode(true);
});

// Controllers

app.controller('appController', ['$scope', function($scope, $route, 
	$routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
}]);

app.controller('sectionController', ['$scope', '$http', function($scope, $http) {
	$scope.sections;
	$http.get('php/query.php', {params: {type: 'Section', sub_layer: true}}).then(
		function successCallback(response) 
		{
			console.log(response.data);
			$scope.sections = response.data;
		}, 
		function errorCallback(response) 
		{
			$scope.sections = [{id: "Not", name: "Working"}, {id: "Not", name: "Working"}, {id: "Not", name: "Working"}];
		});
}]);

app.controller('modelController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	$scope.model;
	$modelId = $routeParams.modelId;
	$http.get('php/query.php', {params: {type: 'Model', sub_layer: true, id: $modelId}}).then(
		function successCallback(response) 
		{
			console.log(response);
			$scope.model = response.data[0];
		}, 
		function errorCallback(response) 
		{
			console.log('Error');
			console.log(response);
		});	
}]);

app.controller('viewController', ['$scope', '$http', function($scope, $http, $routeParams) {
	
}]);

