angular.module('app').directive('deleteChapter', deleteChapter);

deleteChapter.$inject = ['Chapter'];

function deleteChapter(Chapter) {
	return {
		restrict: 'A',
		scope: {
			id: "="
		},
		link: function (scope, element, attrs) {
			function deleteChapter () {
				Chapter.deleteChapter(scope.id);
			}
			element.on('click', deleteChapter);
		}
	};
}

angular.module('app').directive('deleteSpecimen', deleteSpecimen);

deleteSpecimen.$inject = ['Chapter'];

function deleteSpecimen(Chapter) {
	return {
		restrict: 'A',
		scope: {
			mid: '=',
			sid: '='
		},
		link: function (scope, element, attrs) {
			function deleteSpecimen () {
				Chapter.deleteSpecimen(scope.sid, scope.mid);
			}
			element.on('click', deleteSpecimen);
		}
	};
}