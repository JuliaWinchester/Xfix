angular.module('app').controller('ChapterController', ChapterController);

ChapterController.$inject = ['$scope', 'HTTPService', 'Chapter'];

function ChapterController($scope, HTTPService, Chapter) {
	$scope.$on('chapters.update', function(event) {
		$scope.chapters = Chapter.chapters;
	});

	$scope.chapters = Chapter.chapters;
	HTTPService.get('Chapter', 1).then(function (result) { 
		Chapter.addContent(result);
	});

	$scope.numberFilter = function (obj) {
		return obj.data.number;
	};

	$scope.nameFilter = function (obj) {
		return obj.data.name;
	};	
}

angular.module('app').controller('ChapterEditController', 
	ChapterEditController);

ChapterEditController.$inject = ['$scope', 'HTTPService', '$routeParams', 
	'Chapter', '$location'];

function ChapterEditController($scope, HTTPService, $routeParams, Chapter, 
	$location) {
	$scope.$on('chapters.update', function(event) {
		$scope.chapters = Chapter.chapters;
	});

	$scope.chapterId = $routeParams.chapterId;
	$scope.chapters = Chapter.chapters;
	HTTPService.get('Chapter', 1, $scope.chapterId).then(function (result) {
		Chapter.addContent(result);
		$scope.name = Chapter.chapters[0].data.name;
		$scope.number = Chapter.chapters[0].data.number;
	});

	$scope.submit = function () {
		if ($scope.name) {
			Chapter.chapters[0].data.name = $scope.name;
			Chapter.chapters[0].data.number = $scope.number;
			Chapter.saveChapter(Chapter.chapters[0]);
			$scope.redirect();
		}
	};
	$scope.redirect = function () {
		$location.path('/');
	};
}

angular.module('app').controller('ChapterCreateController', 
	ChapterCreateController);

ChapterCreateController.$inject = ['$scope', 'Chapter', '$location'];

function ChapterCreateController($scope, Chapter, $location) {
	$scope.$on('chapters.update', function(event) {
		$scope.chapters = Chapter.chapters;
	});

	$scope.submit = function () {
		if ($scope.name && $scope.number) {
			chapter = {data: {name: $scope.name, number: parseInt($scope.number)}};
			Chapter.saveChapter(chapter);
			$scope.redirect();
		}
	};
	$scope.redirect = function () {
		$location.path('/');
	};
}