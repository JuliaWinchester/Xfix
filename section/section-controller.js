angular.module('app').controller('SectionController', SectionController);

SectionController.$inject = ['$scope', 'HTTPService', 'Section'];

function SectionController($scope, HTTPService, Section) {
	$scope.$on('sections.update', function(event) {
		$scope.sections = Section.sections;
	});

	$scope.sections = Section.sections;
	HTTPService.get('Section', 1).then(function (result) { 
		Section.addContent(result);
	});

	$scope.numberFilter = function (obj) {
		return obj.data.number;
	};

	$scope.nameFilter = function (obj) {
		return obj.data.name;
	};	
}

angular.module('app').controller('SectionEditController', 
	SectionEditController);

SectionEditController.$inject = ['$scope', 'HTTPService', '$routeParams', 
	'Section', '$location'];

function SectionEditController($scope, HTTPService, $routeParams, Section, 
	$location) {
	$scope.$on('sections.update', function(event) {
		$scope.sections = Section.sections;
	});

	$scope.sectionId = $routeParams.sectionId;
	$scope.sections = Section.sections;
	HTTPService.get('Section', 1, $scope.sectionId).then(function (result) {
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
		$location.path('/');
	};
}

angular.module('app').controller('SectionCreateController', 
	SectionCreateController);

SectionCreateController.$inject = ['$scope', 'Section', '$location'];

function SectionCreateController($scope, Section, $location) {
	$scope.$on('sections.update', function(event) {
		$scope.sections = Section.sections;
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
}