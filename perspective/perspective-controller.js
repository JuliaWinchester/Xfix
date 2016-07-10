angular.module('app').controller('PerspectiveController', PerspectiveController);

PerspectiveController.$inject = ['$scope', 'HTTPService', '$routeParams'];

function PerspectiveController($scope, HTTPService, $routeParams) {
	console.log('In perspective controller');
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
    Perspective.get($routeParams.perspectiveId, 1);

    $scope.submit = function () {
        Perspective.submit();
    };


  	// HTTPService.get('Perspective', 1, $routeParams.perspectiveId).then(function (result) {
  	// 	$scope.perspective = result[0];
  	// 	Image.addImage($scope.perspective.data.image, $scope.perspective.data.position_x,
  	// 		$scope.perspective.data.position_y, $scope.perspective.data.scale);
  	// 	$scope.perspective = $scope.validatePerspective($scope.perspective);
   //      Structure.addStructure($scope.perspective.data.labels);
  	// });

   //  $scope.changeImage = function (old_img_src) {
   //      var myFormData = new FormData();
   //      myFormData.append('file', document.getElementById('file').files[0]);
   //      config = {headers: {'Content-Type': undefined}, 
   //          params: {old_image: old_img_src}};
   //      return $http.post('backend/php/upload.php', myFormData, config).then(
   //          function successCallback(response) { 
   //            console.log(response); 
   //            return response; },
   //          function errorCallback(response) { console.log(response); });
   //  };

   //  $scope.save = function () {
   //      $scope.perspective.data.position_x = Image.raster.position.x;
   //      $scope.perspective.data.position_y = Image.raster.position.y;
   //      $scope.perspective.data.scale = 
   //          Image.raster.bounds.width/Image.raster.width;
   //      Structure.updateStructureData();
   //      $scope.perspective.data.labels = Structure.structures;
   //      console.log($scope.perspective);
   //      HTTPService.save($scope.perspective, 'Perspective', 1).then(
   //          function (result) {
   //              console.log('Saved');
   //              if (Structure.trashStruct.length > 0) {
   //                  HTTPService.delete('Label', Structure.trashStruct).then(
   //                      function (result) {
   //                          console.log('Deleted');
   //                          //$scope.redirect();
   //                      });
   //              }
   //      });
   //  };

   //  $scope.submit = function () {
   //      // Code for detecting change in image source and necessary upload/etc goes here
   //      if (Image.raster.source.substring(0, 4) == 'blob') {
   //          $scope.changeImage($scope.perspective.data.image).then( 
   //              function (result) {
   //                  if (result.data.old_image_del == 1) {
   //                      console.log('Previous image deleted from server');
   //                      console.log(result);
   //                  }
   //                  $scope.perspective.data.image = 
   //                      'assets/images/' + result.data.file_uploaded;

   //                  $scope.save();
   //              });  
   //      } else {
   //          $scope.save();
   //      }
   //  };

    $scope.cancel = function () {
        $scope.redirect();
    };

    $scope.redirect = function () {
        console.log('redirect');
        $location.path('/');
    };

  	// $scope.validatePerspective = function (v) {
  	// 	if (!v.data.position_x) { v.data.position_x = Image.raster.position.x; }
  	// 	if (!v.data.position_y) { v.data.position_y = Image.raster.position.y; }
  	// 	if (!v.data.scale) { 
  	// 		v.data.scale = Image.raster.bounds.height/Image.raster.height; 
  	// 	}
  	// 	return v;
  	// };
}

angular.module('app').controller('PerspectiveCreateController', PerspectiveCreateController);

PerspectiveCreateController.$inject = ['$scope', 'HTTPService', '$routeParams'];

function PerspectiveCreateController($scope, HTTPService, $routeParams) {
	console.log('In perspective create controller');
}