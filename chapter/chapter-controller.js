angular.module('app').controller('ChapterController', ChapterController);

ChapterController.$inject = ['$scope', 'HTTPService', 'Chapter', '$mdDialog', 
	'$location', 'LogInService'];

function ChapterController($scope, HTTPService, Chapter, $mdDialog, $location, LogInService) {
	$scope.$on('chapters.update', function(event) {
		$scope.chapters = Chapter.chapters;
	});

	$scope.showSpecimens = {};
	$scope.LogInService = LogInService;
	$scope.title = "Chapter list";
	$scope.headerTemplate = "assets/templates/chapter_template.html";
	$scope.ctrl = "ChapterController";

	$scope.chapters = Chapter.chapters;
	HTTPService.get('Chapter', 1).then(function (result) { 
		Chapter.addContent(result);
	});

	$scope.chapterCreateModal = function(ev) {
		$mdDialog.show({
			controller: ChapterCreateController,
			templateUrl: 'chapter/create.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false
		}).then(function (response) {
			console.log('responded');
			console.log(response);
		}, function () {
			console.log('Cancelled out');
		});
	};

	$scope.chapterEditModal = function(ev, chId) {
		$mdDialog.show({
			controller: ChapterEditController,
			templateUrl: 'chapter/edit.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			locals: {chapterId: chId}
		}).then(function (response) {
			console.log('responded');
			console.log(response);
		}, function () {
			console.log('Cancelled out');
		});
	}

	$scope.specimenCreateModal = function(ev) {
		$mdDialog.show({
			controller: SpecimenCreateController,
			templateUrl: 'specimen/create.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: false
		}).then(function (response) {
			console.log(response);
		}, function () {
			console.log('Cancelled out');
		});
	}

	$scope.specimenEditModal = function(ev, specimenId) {
		$mdDialog.show({
			controller: SpecimenEditController,
			templateUrl: 'specimen/edit.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			locals: {specimenId: specimenId}
		}).then(function (response) {
			console.log('responded');
			console.log(response);
		}, function () {
			console.log('Cancelled out');
		});
	}

	$scope.toggleShow = function (chapter) {
		if (!$scope.showSpecimens[chapter]) {
			$scope.showSpecimens[chapter] = 1;
		} else if ($scope.showSpecimens[chapter]) {
			$scope.showSpecimens[chapter] = 0;
		}
	};

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
	'Chapter', '$location', '$mdDialog', 'chapterId'];

function ChapterEditController($scope, HTTPService, $routeParams, Chapter, 
	$location, $mdDialog, chapterId) {
	$scope.chapterId = chapterId;
	var chIndex = Chapter.findIndex($scope.chapterId, Chapter.chapters);
	
	$scope.name = Chapter.chapters[chIndex].data.name;
	$scope.number = Chapter.chapters[chIndex].data.number;

	$scope.submit = function () {
		if ($scope.name && $scope.number) {
			Chapter.chapters[chIndex].data.name = $scope.name;
			Chapter.chapters[chIndex].data.number = $scope.number;
			Chapter.saveChapter(Chapter.chapters[chIndex]);
			$mdDialog.hide('Chapter edited');
		}
	};

	$scope.cancel = function () {
		$mdDialog.cancel();
	};
}

angular.module('app').controller('ChapterCreateController', 
	ChapterCreateController);

ChapterCreateController.$inject = ['$scope', 'Chapter', '$location', '$mdDialog'];

function ChapterCreateController($scope, Chapter, $location, $mdDialog) {
	$scope.$on('chapters.update', function(event) {
		$scope.chapters = Chapter.chapters;
	});

	$scope.submit = function () {
		if ($scope.name && $scope.number) {
			chapter = {data: {name: $scope.name, number: parseInt($scope.number)}};
			Chapter.saveChapter(chapter);
			$mdDialog.hide('New chapter added');
		}
	};
	$scope.cancel = function () {
		$mdDialog.cancel();
	};
}