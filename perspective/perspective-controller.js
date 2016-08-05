angular.module('app').controller('PerspectiveController', PerspectiveController);

PerspectiveController.$inject = ['$scope', '$routeParams', 'Perspective'];

function PerspectiveController($scope, $routeParams, Perspective) {
    Perspective.get($routeParams.perspectiveId, 1);
}

angular.module('app').controller('PerspectiveEditController', PerspectiveEditController);

PerspectiveEditController.$inject = ['$scope', '$routeParams', '$timeout', 
    '$location', 'Structure', 'Perspective', 'Image'];

function PerspectiveEditController($scope, $routeParams, $timeout, $location,
    Structure, Perspective, Image) {
	$scope.$on('structures.update', function(event) {
    	$timeout(function () {
            $scope.structures = Structure.structures;
            $scope.textvar = "";
        }); 
  	});
    
    $scope.headerTemplate = "assets/templates/perspective_template.html";
    $scope.headerLeftTemplate = "assets/templates/perspective_left_template.html";
    $scope.banner = "Edit perspective";

    Structure.reset();
  	$scope.structures = Structure.structures;
  	$scope.textvar = "";
    Perspective.get($routeParams.perspectiveId, 1).then(function (result) {
        $scope.ptype = Perspective.p.data.type;
    });

    $scope.upload = function (files) {
        Image.addImage(files[0]);
    };

    $scope.submit = function () {
        Perspective.submit($scope.ptype).then(function () {
            $scope.redirect();
        });
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
    '$location', 'Structure', 'Perspective', 'Image'];

function PerspectiveCreateController($scope, $routeParams, $timeout, $location,
    Structure, Perspective, Image) {
	$scope.$on('structures.update', function(event) {
        $timeout(function () {
            $scope.structures = Structure.structures;
            $scope.textvar = "";
        }); 
    });
  
    $scope.headerTemplate = "assets/templates/perspective_template.html";
    $scope.headerLeftTemplate = "assets/templates/perspective_left_template.html";
    $scope.banner = "Create perspective";

    Structure.reset();
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

    $scope.upload = function (files) {
        Image.addImage(files[0]);
    };

    $scope.submit = function () {
        Perspective.submit($scope.ptype).then(function () {
            console.log('starting redirect');
            $scope.redirect();
        });
    };

    $scope.cancel = function () {
        $scope.redirect();
    };

    $scope.redirect = function () {
        console.log('redirect');
        $location.path('/specimen/'+$routeParams.specimenId);
    };
}