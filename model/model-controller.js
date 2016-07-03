angular.module('app').controller('ModelController', ModelController);

ModelController.$inject = ['$scope', '$routeParams', 'HTTPService'];

function ModelController($scope, $routeParams, HTTPService) {
	HTTPService.get('Model', 1, $routeParams.modelId).then(function (result) {
		$scope.model = result[0];
	});
}

angular.module('app').controller('ModelEditController', ModelEditController);

ModelEditController.$inject = ['$scope', 'HTTPService', 'Section', '$location', 
	'$routeParams'];

function ModelEditController($scope, HTTPService, Section, $location, 
	$routeParams) {
	$scope.modelId = $routeParams.modelId;

	HTTPService.get('Model', 0, $scope.modelId).then(function (result) {
		$scope.model = result[0];
		$scope.chapterId = String($scope.model.data.section_id);
	});

	HTTPService.get('Section', 0).then(function (result) {
		Section.addContent(result);
		$scope.sections = Section.sections;
	});

	$scope.submit = function () {
		if ($scope.model.data.name && $scope.model.data.type && 
			$scope.model.data.description && $scope.chapterId) {
			$scope.model.data.section_id = $scope.chapterId;
			HTTPService.save($scope.model, 'Model').then(function (result) {
				$scope.redirect();
			});
		}
	};

	$scope.redirect = function () {
		$location.path('/');
	};

	$scope.numberFilter = function (obj) {
		return obj.data.number;
	};
}

angular.module('app').controller('ModelCreateController', 
	ModelCreateController);

ModelCreateController.$inject = ['$scope', 'HTTPService', 'Section', 
	'$location'];

function ModelCreateController($scope, HTTPService, Section, $location) {
	$scope.name = "";
	$scope.type = 'Plastic model';
	$scope.desc = "";
	$scope.chapterId = '1';

	HTTPService.get('Section', 1).then(function (result) {
		Section.addContent(result);
		$scope.sections = Section.sections;
	
	});

	$scope.submit = function () {
		if ($scope.name && $scope.type && $scope.desc && $scope.chapterId) {
			var model = {data: {name: $scope.name, type: $scope.type, 
				description: $scope.desc, section_id: $scope.chapterId}};
			HTTPService.save(model, 'Model').then(function (result) {
				$scope.redirect();
			});
		}
	};

	$scope.redirect = function () {
		$location.path('/');
	};

	$scope.numberFilter = function (obj) {
		return obj.data.number;
	};
}