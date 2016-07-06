angular.module('app').controller('SpecimenController', SpecimenController);

SpecimenController.$inject = ['$scope', '$routeParams', 'HTTPService'];

function SpecimenController($scope, $routeParams, HTTPService) {
	HTTPService.get('Specimen', 1, $routeParams.specimenId).then(function (result) {
		$scope.specimen = result[0];
	});
}

angular.module('app').controller('SpecimenEditController', SpecimenEditController);

SpecimenEditController.$inject = ['$scope', 'HTTPService', 'Chapter', '$location', 
	'$routeParams'];

function SpecimenEditController($scope, HTTPService, Chapter, $location, 
	$routeParams) {
	$scope.specimenId = $routeParams.specimenId;

	HTTPService.get('Specimen', 0, $scope.specimenId).then(function (result) {
		$scope.specimen = result[0];
		$scope.chapterId = String($scope.specimen.data.chapter_id);
	});

	HTTPService.get('Chapter', 0).then(function (result) {
		Chapter.addContent(result);
		$scope.chapters = Chapter.chapters;
	});

	$scope.submit = function () {
		if ($scope.specimen.data.name && $scope.specimen.data.type && 
			$scope.specimen.data.description && $scope.chapterId) {
			$scope.specimen.data.chapter_id = $scope.chapterId;
			HTTPService.save($scope.specimen, 'Specimen').then(function (result) {
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

angular.module('app').controller('SpecimenCreateController', 
	SpecimenCreateController);

SpecimenCreateController.$inject = ['$scope', 'HTTPService', 'Chapter', 
	'$location'];

function SpecimenCreateController($scope, HTTPService, Chapter, $location) {
	$scope.name = "";
	$scope.type = 'Plastic model';
	$scope.desc = "";
	$scope.chapterId = '1';

	HTTPService.get('Chapter', 1).then(function (result) {
		Chapter.addContent(result);
		$scope.chapters = Chapter.chapters;
	
	});

	$scope.submit = function () {
		if ($scope.name && $scope.type && $scope.desc && $scope.chapterId) {
			var specimen = {data: {name: $scope.name, type: $scope.type, 
				description: $scope.desc, chapter_id: $scope.chapterId}};
			HTTPService.save(specimen, 'Specimen').then(function (result) {
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