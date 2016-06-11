var app = angular.module('index', []);

// App Controller

app.controller("indexController", ["$scope", function($scope) {
	$scope.getSections = function() {

	}
}]);

// App service for list of sections with model and view data

app.service('Section', ['$rootScope', function($rootScope) {
	var service = {
		sections: [],
		readAllData: function () {
			sections = readSections();
			models = readModels();
			views = readViews();

			// Convert models from array to object here for discontinuous id keys
			tempObj = {};
			for (var i = 0; i < models.length; i++) {
				models[i] = tempObj[models[i].id];
			}
			models = tempObj;

			// Associating view objects from view array with models object
			for (var i = 0; i < views.length; i++) {
				modelId = views[i].modelId;
				if (!models[modelId].views) {
						models[modelId].views = [views[i]];
					} else {
						models[modelId].views.push(views[i])
					}
			}

			// Convert models back from object to array
			tempArray = [];
			for (var key in models) {
				if (models.hasOwnProperty(key)) {
					tempArray.push(models[key]);
				}
			}
			
			// Associating model objects from models array with section array
			for (var i = 0; i < models.length; i++) {
				sectionId = models[i].sectionId - 1;
				if (!sections[sectionId].models) {
						sections[sectionId].models = [models[i]];
					} else {
						sections[sectionId].models.push(models[i])
					}
			}

			return sections;
		},
		readSections: function () {
			// Gets list of sections from HTTP post, returns array of section objects. 
			$http.get('/php/section.php').then(function successCallback(response) {

			}, function errorCallback(response) {

				});
		},
		readModels: function (sectionIds=false) {
			// Gets list of models from HTTP post, returns array of model objects.
			if (sectionIds) {
				paramData = {sectionIds: sectionIds};
			} else {
				paramData = {};
			}
			$http.get('/php/model.php', {params: paramData}).then(function successCallback(response) {

			}, function errorCallback(response) {

				});
		},
		readViews: function (modelIds=false) {
			// Get list of views from HTTP post, returns array of view objects.  
			if (modelIds) {
				paramData = {modelIds: modelIds};
			} else {
				paramData = {};
			}
			$http.get('/php/view.php', {params: paramData}).then(function successCallback(response) {

			}, function errorCallback(response) {

				});
		}
	}

	return service;
}]);

// App factories

// Factory for returning a list of sections using HTTP POST

// Factory for returning a list of objects using HTTP POST

// Factory for returning a list of views using HTTP POST