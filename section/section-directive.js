angular.module('app').directive('deleteSection', deleteSection);

deleteSection.$inject = ['Section'];

function deleteSection(Section) {
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
}

angular.module('app').directive('deleteModel', deleteModel);

deleteModel.$inject = ['Section'];

function deleteModel(Section) {
	return {
		restrict: 'A',
		scope: {
			mid: '=',
			sid: '='
		},
		link: function (scope, element, attrs) {
			function deleteModel () {
				Section.deleteModel(scope.sid, scope.mid);
			}
			element.on('click', deleteModel);
		}
	};
}