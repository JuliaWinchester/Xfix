angular.module('app').controller('PerspectiveController', PerspectiveController);

PerspectiveController.$inject = ['$scope', '$routeParams', 'Perspective'];

function PerspectiveController($scope, $routeParams, Perspective) {
    Perspective.get($routeParams.perspectiveId, 1);
}

angular.module('app').controller('PerspectiveEditController', PerspectiveEditController);

PerspectiveEditController.$inject = ['$scope', '$routeParams', '$timeout', 
    '$location', 'Structure', 'Perspective'];

function PerspectiveEditController($scope, $routeParams, $timeout, $location,
    Structure, Perspective) {
	$scope.$on('structures.update', function(event) {
    	$timeout(function () {
            $scope.structures = Structure.structures;
            $scope.textvar = "";
        }); 
  	});
	
  	$scope.structures = Structure.structures;
  	$scope.textvar = "";
    $scope.ptype = "";
    Perspective.get($routeParams.perspectiveId, 1).then(function (result) {
        $scope.ptype = Perspective.p.data.type;
    });


    $scope.submit = function () {
        Perspective.submit($scope.ptype);
    };

    $scope.cancel = function () {
        $scope.redirect();
    };

    $scope.redirect = function () {
        console.log('redirect');
        $location.path('/specimen/'+$routeParams.specimenId);
    };

}

angular.module('app').controller('PerspectiveCreateController', PerspectiveCreateController);

PerspectiveCreateController.$inject = ['$scope', '$routeParams', '$timeout', 
    '$location', 'Structure', 'Perspective'];

function PerspectiveCreateController($scope, $routeParams, $timeout, $location,
    Structure, Perspective) {
	$scope.$on('structures.update', function(event) {
        $timeout(function () {
            $scope.structures = Structure.structures;
            $scope.textvar = "";
        }); 
    });
  
    $scope.structures = Structure.structures;
    $scope.textvar = "";
    $scope.ptype = "";
    
    Perspective.p = {
        data: {
            id: null,
            type: null,
            image: null,
            scale: null,
            position_x: null,
            position_y: null,
            labels: [],
            save_fields: ['type', 'image', 'scale', 'position_x', 
                'position_y', 'specimen_id'],
            specimen_id: $routeParams.specimenId
        }
    };


    $scope.submit = function () {
        Perspective.submit($scope.ptype);
    };

    $scope.cancel = function () {
        $scope.redirect();
    };

    $scope.redirect = function () {
        console.log('redirect');
        $location.path('/specimen/'+$routeParams.specimenId);
    };
}