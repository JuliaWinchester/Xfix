var app = angular.module('app', ['ngRoute', 'routeStyles', 'iconolater']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/section/edit/:sectionId', {
			templateUrl: 'section/edit.html',
			controller: 'SectionEditController'
		})
		.when('/section/create', {
			templateUrl: 'section/create.html',
			controller: 'SectionCreateController'
		})
		.when('/model/create', {
			templateUrl: 'model/create.html',
			controller: 'ModelCreateController'
		})
		.when('/model/:modelId', {
			templateUrl: 'model/model.html',
			controller: 'ModelController'
		})
		.when('/model/edit/:modelId', {
			templateUrl: 'model/edit.html',
			controller: 'ModelEditController'
		})
		.when('/model/:modelId/view/:viewId', {
			templateUrl: 'view/view.html',
			controller: 'ViewController',
			css: 'view/view.css'
		})
		.when('/model/:modelId/view/edit/:viewId', {
			templateUrl: 'view/edit.html',
			controller: 'ViewEditController',
			css: 'view/view.css'
		})
		.when('/model/:modelId/view/create', {
			templateUrl: 'view/create.html',
			controller: 'ViewCreateController'
		})
		.otherwise({
			templateUrl: 'section/section.html',
			controller: 'SectionController'
		});
});