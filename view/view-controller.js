angular.module('app').controller('ViewController', ViewController);

ViewController.$inject = ['$scope', 'HTTPService', '$routeParams'];

function ViewController($scope, HTTPService, $routeParams) {
	console.log('In view controller');
}

angular.module('app').controller('ViewEditController', ViewEditController);

ViewEditController.$inject = ['$scope', 'HTTPService', '$routeParams', 
	'Structure', 'Image', '$timeout'];

function ViewEditController($scope, HTTPService, $routeParams, Structure, 
	Image, $timeout) {
	$scope.$on('structures.update', function(event) {
    	$timeout(function () {
            $scope.structures = Structure.structures;
            $scope.textvar = "";
        }); 
  	});
	
  	$scope.structures = Structure.structures;
  	$scope.textvar = "";

  	HTTPService.get('View', 1, $routeParams.viewId).then(function (result) {
  		$scope.view = result[0];
  		Image.addImage($scope.view.data.image, $scope.view.data.position_x,
  			$scope.view.data.position_y, $scope.view.data.scale);
  		$scope.view = validateView($scope.view);
        for (var i = 0; i < $scope.view.data.labels.length; i++) {
            var label = $scope.view.data.labels[i].data;
            Structure.addStructure(label.name, label.id, label.label_position_x,
                label.label_position_y, label.arrow_position_x, 
                label.arrow_position_y);
      }
       
  	});

  	function validateView(v) {
  		if (!v.data.position_x) { v.data.position_x = Image.raster.position.x; }
  		if (!v.data.position_y) { v.data.position_y = Image.raster.position.y; }
  		if (!v.data.scale) { 
  			v.data.scale = Image.raster.bounds.height/Image.raster.height; 
  		}
  		return v;
  	}
}

angular.module('app').controller('ViewCreateController', ViewCreateController);

ViewCreateController.$inject = ['$scope', 'HTTPService', '$routeParams'];

function ViewCreateController($scope, HTTPService, $routeParams) {
	console.log('In view create controller');
}