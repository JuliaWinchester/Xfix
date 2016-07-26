var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngCookies', 'iconolater']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/chapter/edit/:chapterId', {
			templateUrl: 'chapter/edit.html',
			controller: 'ChapterEditController'
		})
		.when('/chapter/create', {
			templateUrl: 'chapter/create.html',
			controller: 'ChapterCreateController'
		})
		.when('/specimen/create', {
			templateUrl: 'specimen/create.html',
			controller: 'SpecimenCreateController'
		})
		.when('/specimen/:specimenId', {
			templateUrl: 'specimen/specimen.html',
			controller: 'SpecimenController'
		})
		.when('/specimen/edit/:specimenId', {
			templateUrl: 'specimen/edit.html',
			controller: 'SpecimenEditController'
		})
		.when('/specimen/:specimenId/perspective/create', {
			templateUrl: 'perspective/create.html',
			controller: 'PerspectiveCreateController'
		})
		.when('/specimen/:specimenId/perspective/:perspectiveId', {
			templateUrl: 'perspective/perspective.html',
			controller: 'PerspectiveController'
		})
		.when('/specimen/:specimenId/perspective/edit/:perspectiveId', {
			templateUrl: 'perspective/edit.html',
			controller: 'PerspectiveEditController'
		})
		.when('/login', {
			templateUrl: 'login/login.html',
			controller: 'AppController'
		})
		.otherwise({
			templateUrl: 'chapter/chapter.html',
			controller: 'ChapterController'
		});
});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .accentPalette('grey');
});