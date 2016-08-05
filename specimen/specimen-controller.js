angular.module('app').controller('SpecimenController', SpecimenController);

SpecimenController.$inject = ['$scope', '$routeParams', '$mdDialog', 'HTTPService', 
	'Perspective', '$document', '$timeout', 'LogInService', 'Chapter'];

function SpecimenController($scope, $routeParams, $mdDialog, HTTPService, 
	Perspective, $document, $timeout, LogInService, Chapter) {
	$scope.LogInService = LogInService;
	$scope.currentId = null;
	$scope.specimenMatches = [];
	$scope.labelButtonText = "Hide labels";
	$scope.headerLeftTemplate = "assets/templates/specimen_left_template.html";
	$scope.headerTemplate = "assets/templates/specimen_template.html";
	$scope.chapter = null;

	if (typeof tool !== 'undefined') { // Remove any pre-existing PaperJS tool from Perspective create/edit
		if (tool !== null) { tool.remove(); }
	}

	HTTPService.get('Specimen', 1, $routeParams.specimenId).then(function (result) {
		$scope.specimen = result[0];
        $scope.getPerspective($scope.specimen.data.perspectives[0].data.id);
        HTTPService.get('Chapter', 1, $scope.specimen.data.chapter_id).then(function (result) { 
			Chapter.addContent(result);
			$scope.chapter = Chapter.chapters[0];
		});
	});

	$scope.toggleLabels = function () {
		if ($scope.labelButtonText == "Hide labels") {
			Perspective.toggleLabels();
			//view.draw();
			$scope.labelButtonText = "Show labels";
		} else if ($scope.labelButtonText == "Show labels") {
			Perspective.toggleLabels();
			//view.draw();
			$scope.labelButtonText = "Hide labels";
		}
	};

	$scope.filterNonSelf = function (specimen) {
		return specimen.data.id != $routeParams.specimenId;
	};

	$scope.getPerspective = function (pId) {
		Perspective.get(pId, 1, $scope).then(function () {
			$scope.currentId = Perspective.p.data.id;
			HTTPService.get('Specimen', 1, null, Perspective.p.data.id).then(function (result) {
				console.log('Other specimens with these structures');
				console.log(result);
				$scope.specimenMatches = result; 
			});
		});
	};

	$scope.specimenDeleteModal = function(ev) {
		var confirm = $mdDialog.confirm()
			.title('Delete confirmation')
			.textContent('Are you sure you want to delete this view? This is permanent and irreversible!')
			.ariaLabel('Delete confirmation')
			.targetEvent(ev)
			.ok('Delete')
			.cancel('Cancel')
		$mdDialog.show(confirm).then(function () {
			console.log('Deleting perspective');
			$scope.deletePerspective();
		}, function () {
			console.log('Cancelled out');
		});
	};

	$scope.deletePerspective = function() {
		pIndex = $scope.findPerspectiveIndex(Perspective.p.data.id);
		Perspective.delete().then(function () {
			$scope.specimen.data.perspectives.splice(pIndex, 1);
			$scope.getPerspective($scope.specimen.data.perspectives[0].data.id);
		});
	};

	$scope.findPerspectiveIndex = function (pId) {
      	var result = $scope.specimen.data.perspectives.filter(function(obj) {
        	return obj.data.id == pId; })[0];
      	return $scope.specimen.data.perspectives.indexOf(result);
	};

	$scope.nameFilter = function (obj) {
		return obj.data.name;
	};
}

angular.module('app').controller('SpecimenEditController', SpecimenEditController);

SpecimenEditController.$inject = ['$scope', 'HTTPService', 'Chapter', '$location', 
	'$routeParams', '$mdDialog', 'specimenId'];

function SpecimenEditController($scope, HTTPService, Chapter, $location, 
	$routeParams, $mdDialog, specimenId) {
	$scope.specimenId = specimenId;

	HTTPService.get('Specimen', 0, $scope.specimenId).then(function (result) {
		$scope.specimen = result[0];
		$scope.chapterId = String($scope.specimen.data.chapter_id);
	});

	$scope.chapters = Chapter.chapters;

	$scope.submit = function () {
		if ($scope.specimen.data.name && $scope.specimen.data.type && 
			$scope.specimen.data.description && $scope.chapterId) {
			$scope.specimen.data.chapter_id = $scope.chapterId;
			HTTPService.save($scope.specimen, 'Specimen').then(function (result) {
				var chIndex = Chapter.findIndex($scope.chapterId, Chapter.chapters);
				var sIndex = Chapter.findIndex($scope.specimen.data.id,
					Chapter.chapters[chIndex].data.specimens);
				Chapter.chapters[chIndex].data.specimens[sIndex] = $scope.specimen;
				$mdDialog.hide('Specimen edited');
			});
		}
	};

	$scope.cancel = function () {
		$mdDialog.cancel();
	};

	$scope.numberFilter = function (obj) {
		return obj.data.number;
	};
}

angular.module('app').controller('SpecimenCreateController', 
	SpecimenCreateController);

SpecimenCreateController.$inject = ['$scope', 'HTTPService', 'Chapter', 
	'$location', '$mdDialog'];

function SpecimenCreateController($scope, HTTPService, Chapter, $location, 
	$mdDialog) {
	$scope.name = "";
	$scope.type = 'Plastic model';
	$scope.desc = "";
	$scope.chapterId = '1';

	$scope.chapters = Chapter.chapters;
	
	$scope.submit = function () {
		if ($scope.name && $scope.type && $scope.desc && $scope.chapterId) {
			var specimen = {data: {name: $scope.name, type: $scope.type, 
				description: $scope.desc, chapter_id: $scope.chapterId}};
			HTTPService.save(specimen, 'Specimen').then(function (result) {
				var specimen = result.data[0];
				var chIndex = Chapter.findIndex($scope.chapterId, Chapter.chapters);
				Chapter.chapters[chIndex].data.specimens.push(specimen);
				$mdDialog.hide('Specimen added');
			});
		}
	};

	$scope.cancel = function () {
		$mdDialog.cancel();
	};

	$scope.numberFilter = function (obj) {
		return obj.data.number;
	};
}