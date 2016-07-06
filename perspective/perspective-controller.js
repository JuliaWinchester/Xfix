angular.module('app').controller('PerspectiveController', PerspectiveController);

PerspectiveController.$inject = ['$scope', 'HTTPService', '$routeParams'];

function PerspectiveController($scope, HTTPService, $routeParams) {
	console.log('In perspective controller');
}

angular.module('app').controller('PerspectiveEditController', PerspectiveEditController);

PerspectiveEditController.$inject = ['$scope', 'HTTPService', '$routeParams', 
	'Structure', 'Image', '$timeout', '$location'];

function PerspectiveEditController($scope, HTTPService, $routeParams, Structure, 
	Image, $timeout, $location) {
	$scope.$on('structures.update', function(event) {
    	$timeout(function () {
            $scope.structures = Structure.structures;
            $scope.textvar = "";
        }); 
  	});
	
  	$scope.structures = Structure.structures;
  	$scope.textvar = "";

  	HTTPService.get('Perspective', 1, $routeParams.perspectiveId).then(function (result) {
  		$scope.perspective = result[0];
  		Image.addImage($scope.perspective.data.image, $scope.perspective.data.position_x,
  			$scope.perspective.data.position_y, $scope.perspective.data.scale);
  		$scope.perspective = $scope.validatePerspective($scope.perspective);
        Structure.addStructure($scope.perspective.data.labels);
  	});

    $scope.submit = function () {
        var base = "http://localhost/Xfix/";
        if (Image.raster.source.indexOf(base) >= 0) {
            $scope.perspective.data.image = 
                Image.raster.source.replace(base, '');
        } else {
            console.log('Error. Image source not in base');
            return;
        }
        $scope.perspective.data.position_x = Image.raster.position.x;
        $scope.perspective.data.position_y = Image.raster.position.y;
        Structure.updateStructureData();
        $scope.perspective.data.labels = Structure.structures;
        console.log($scope.perspective);
        HTTPService.save($scope.perspective, 'Perspective', 1).then(
            function (result) {
                console.log('Saved');
                if (Structure.trashStruct.length > 0) {
                    HTTPService.delete('Label', Structure.trashStruct).then(
                        function (result) {
                            console.log('Deleted');
                            //$scope.redirect();
                        });
                }
        });
    };

    $scope.cancel = function () {
        $scope.redirect();
    };

    $scope.redirect = function () {
        console.log('redirect');
        $location.path('/');
    };

  	$scope.validatePerspective = function (v) {
  		if (!v.data.position_x) { v.data.position_x = Image.raster.position.x; }
  		if (!v.data.position_y) { v.data.position_y = Image.raster.position.y; }
  		if (!v.data.scale) { 
  			v.data.scale = Image.raster.bounds.height/Image.raster.height; 
  		}
  		return v;
  	};
}

angular.module('app').controller('PerspectiveCreateController', PerspectiveCreateController);

PerspectiveCreateController.$inject = ['$scope', 'HTTPService', '$routeParams'];

function PerspectiveCreateController($scope, HTTPService, $routeParams) {
	console.log('In perspective create controller');
}