var app = angular.module('app', ['ngRoute']);

// Configuration

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/section/edit/:sectionId', {
			templateUrl: 'section/edit.html',
			controller: 'sectionEditController'
		})
		.when('/section/create', {
			templateUrl: 'section/create.html',
			controller: 'sectionCreateController'
		})
		.when('/model/:modelId', {
			templateUrl: 'model/model.html',
			controller: 'modelController'
		})
		.when('/model/edit/:modelId', {
			templateUrl: 'model/edit.html',
			controller: 'modelEditController'
		})
		.when('/model/create', {
			templateUrl: 'model/create.html',
			controller: 'modelCreateController'
		})
		.when('/model/:modelId/view/:viewId', {
			templateUrl: 'view/view.html',
			controller: 'viewController'
		})
		.when('/model/:modelId/view/edit/:viewId', {
			templateUrl: 'view/edit.html',
			controller: 'viewEditController'
		})
		.when('/model/:modelId/view/create', {
			templateUrl: 'view/create.html',
			controller: 'viewCreateController'
		})
		.otherwise({
			templateUrl: 'section/section.html',
			controller: 'sectionController'
		});

});

// Services

app.service('HTTPService', ['$http', function ($http) {
	var service = {
		get: function (type, sub_layer, id, match_view_id) {
			var t = typeof type !== 'undefined' ?  type : null;
			var s = typeof sub_layer !== 'undefined' ?  sub_layer : 0;
			var i = typeof id !== 'undefined' ?  id : null;
			var m_id = 
				typeof match_view_id !== 'undefined' ?  match_view_id : null;

			var config = {params: 
				{type: t, sub_layer: s, id: i, match_view_id: m_id}};
			return $http.get('php/query.php', config).then(
				function successCallback(response) {
					return response.data;
				}, 
				function errorCallback(response) {
					service.handleError(response);
				});
		},
		save: function (obj, type, sub_layer) {
			var o = typeof obj !== 'undefined' ?  obj : null;
			var t = typeof type !== 'undefined' ?  type : null;
			var s = typeof sub_layer !== 'undefined' ?  sub_layer : 0;
			var config = {params: {mode: 'save', type: t, sub_layer: s}};
			return $http.post('php/post.php', {obj: o}, config).then(
				function successCallback(response) {
					console.log(response);
					return response;
				},
				function errorCallback(response) {
					service.handleError(response);
				});
		},
		delete: function (type, obj) {
			var t = typeof type !== 'undefined' ?  type : null;
			var s = typeof sub_layer !== 'undefined' ?  sub_layer : 0;
			var o = typeof obj !== 'undefined' ?  obj : null;

			var config = {params: {mode: 'delete', type: t}};
			return $http.post('php/post.php', {obj: o}, config).then(
				function successCallback(response) {
					console.log(response);
					return response;
				},
				function errorCallback(response) {
					service.handleError(response);
				});
		},
		handleError: function (response) {
			console.log('Error in HTTP query or post!');
			console.log('HTTP Status Text: ' + response.statusText);
			console.log('HTTP Status: ' + response.status);
			console.log('Transmitted configuration object:');
			console.log(response.config);
			console.log('Returned data object (if present):');
			console.log(response.data);
		}
	};
	return service;
}]);

app.service('Section', ['$rootScope', 'HTTPService', function($rootScope, HTTPService) {
	var service = {
		sections: [],
		findIndex: function (id, searchArray) {
			var filter = searchArray.filter(function(obj) {
				return obj.data.id == id; });
			if (filter.length > 1) {
				console.log('Duplicate IDs seem to be present?');
				return false; // Better error later
			}
			return searchArray.indexOf(filter[0]);
		},
		addContent: function (content) {
			service.sections = content;
			$rootScope.$broadcast('sections.update');
		},
		deleteSection: function (id) {
			sIndex = service.findIndex(id, service.sections);
			HTTPService.delete('Section', service.sections[sIndex]).then(
				function (result) {
					if (result.status > 199 && result.status < 300) {
						service.sections.splice(sIndex, 1);
						$rootScope.$broadcast('sections.update');
						return result.data;
					} else {
						console.log('Something went wrong deleting section.');
					}
				});
		},
		saveSection: function (obj, sub_layer) {
			var l = typeof sub_layer !== 'undefined' ?  sub_layer : 0;
			
			HTTPService.save(obj, 'Section', l).then(
				function (result) {
					if (result.status > 199 && result.status < 300) {
						sIndex = service.findIndex(result.data[0].data.id, service.sections);
						if (sIndex == -1) {
							service.sections.push(result.data[0]);
						} else {
							service.sections[sIndex] = result.data[0];
						}
						$rootScope.$broadcast('sections.update');
					} else {
						console.log('Something went wrong saving section.');
					}
				});
		},
		deleteModel: function (sId, mId) {
			sIndex = service.findIndex(sId, service.sections);
			mIndex = service.findIndex(mId, service.sections[sIndex]);
			success = HTTPService.delete('Model', 
				service.sections[sIndex].data.models[mIndex]);
			if (success) {
				service.sections[sIndex].data.models[mIndex].splice(mIndex, 1);
				$rootScope.$broadcast('sections.update');
				return success;
			} else {
				console.log('Error deleting model.');
			}	
		}
	};
	return service;
}]);

// Controllers

app.controller('appController', ['$scope', function($scope, $route, 
	$routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
}]);

// Section controllers

app.controller('sectionController', ['$scope', 'HTTPService', 'Section', function($scope, HTTPService, Section) {
	$scope.$on('sections.update', function(event) {
		$scope.sections = Section.sections;
		//$scope.$apply(); Seems to be unneeded but in case it's needed later...
	});
	$scope.sections = Section.sections;
	HTTPService.get('Section', true).then(function (result) { 
		Section.addContent(result);
	});

	$scope.numberFilter = function (obj) {
		return obj.data.number;
	};
}]);

app.directive('deleteSection', ['Section', function (Section) {
	return {
		restrict: 'A',
		scope: {
			id: "="
		},
		link: function (scope, element, attrs) {
			function deleteSection () {
				Section.deleteSection(scope.id);
			}
			element.on('click', deleteSection);
		}
	};
}]);

app.directive('deleteModel', ['Section', function (Section) {
	return {
		restrict: 'A',
		scope: {
			mid: '=',
			sid: '='
		},
		link: function (scope, element, attrs) {
			function deleteModel () {
				Section.deleteModel(scope.sid, scope.mid);
				console.log('Model baleeted');
			}
		}
	};
}]);

app.controller('sectionEditController', 
	['$scope', 'HTTPService', '$routeParams', 'Section', '$location',  
	function($scope, HTTPService, $routeParams, Section, $location) {
	$scope.$on('sections.update', function(event) {
		$scope.sections = Section.sections;
		//$scope.$apply();
	});

	$scope.sectionId = $routeParams.sectionId;
	$scope.sections = Section.sections;
	HTTPService.get('Section', true, $scope.sectionId).then(function (result) {
		Section.addContent(result);
		$scope.name = Section.sections[0].data.name;
		$scope.number = Section.sections[0].data.number;
	});

	$scope.submit = function () {
		if ($scope.name) {
			Section.sections[0].data.name = $scope.name;
			Section.sections[0].data.number = $scope.number;
			Section.saveSection(Section.sections[0]);
			$scope.redirect();
		}
	};
	$scope.redirect = function () {
		$location.path('/#/');
	};
}]);

app.controller('sectionCreateController', 
	['$scope', 'Section', '$location', function($scope, Section, $location) {
	$scope.$on('sections.update', function(event) {
		$scope.sections = Section.sections;
		//$scope.$apply();
	});

	$scope.submit = function () {
		if ($scope.name && $scope.number) {
			section = {data: {name: $scope.name, number: parseInt($scope.number)}};
			Section.saveSection(section);
			$scope.redirect();
		}
	};
	$scope.redirect = function () {
		$location.path('/');
	};
}]);

// Model controllers

app.controller('modelController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	console.log('In model controller!');
	$scope.model = null;
	$modelId = $routeParams.modelId;
	
}]);

app.controller('modelEditController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	console.log('In model edit controller!');
	$scope.model = null;
	$modelId = $routeParams.modelId;
	
}]);

app.controller('modelCreateController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	console.log('In model create controller!');
	$scope.model = null;
	$modelId = $routeParams.modelId;
	
}]);

// View controllers

app.controller('viewController', ['$scope', '$http', function($scope, $http, $routeParams) {
	
}]);

