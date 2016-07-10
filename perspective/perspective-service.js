angular.module('app').service('Perspective', Perspective);

Perspective.$inject = ['HTTPService', 'Image', 'Structure'];

function Perspective(HTTPService, Image, Structure) {
	var service = {
		p: {},
		get: function (perspectiveId, getLabel) {
			HTTPService.get('Perspective', getLabel, perspectiveId).then(
				function (result) {
  					service.p = result[0];
  					Image.addImage(service.p.data.image, service.p.data.position_x,
  					service.p.data.position_y, service.p.data.scale);
        			Structure.addStructure(service.p.data.labels);
  			});
		},
		save: function () {
			service.p.data.position_x = Image.raster.position.x;
        	service.p.data.position_y = Image.raster.position.y;
        	service.p.data.scale = Image.raster.bounds.width/Image.raster.width;
        	Structure.updateStructureData();
        	service.p.data.labels = Structure.structures;
        	console.log(service.p);
        	HTTPService.save(service.p, 'Perspective', 1).then(
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
		},
		submit: function () {
        	if (Image.raster.source.substring(0, 4) == 'blob') {
        		var file = document.getElementById('file').files[0];
            	HTTPService.img_upload(file, service.p.data.image).then( 
                	function (result) {
                    	if (result.data.old_image_del == 1) {
                        	console.log('Previous image deleted from server');
                        	console.log(result);
                    	}
                    	service.p.data.image = 
                        	'assets/images/' + result.data.file_uploaded;

                    	service.save();
                });  
        	} else {
         		service.save();
			}
		}
	};
	return service;
}	