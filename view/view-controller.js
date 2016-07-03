angular.module('app').controller('ViewController', ViewController);

ViewController.$inject = ['$scope', 'HTTPService', '$routeParams'];

function ViewController($scope, HTTPService, $routeParams) {
	console.log('In view controller');
}

angular.module('app').controller('ViewEditController', ViewEditController);

ViewEditController.$inject = ['$scope', 'HTTPService', '$routeParams', 'Structure'];

function ViewEditController($scope, HTTPService, $routeParams, Structure) {
	console.log('In view edit controller');

	$scope.$on('structures.update', function(event) {
    	$scope.structures = Structure.structures;
    	$scope.textvar = "";
    	$scope.selectedStructures.splice(0, $scope.selectedStructures.length);
    	$scope.$apply(); 
  	});
	
  	$scope.structures = Structure.structures;
  	$scope.textvar;
  	$scope.selectedStructures = [];
  	$scope.cheight = 600;
}

angular.module('app').controller('ViewCreateController', ViewCreateController);

ViewCreateController.$inject = ['$scope', 'HTTPService', '$routeParams'];

function ViewCreateController($scope, HTTPService, $routeParams) {
	console.log('In view create controller');
}