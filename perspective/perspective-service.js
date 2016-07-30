angular.module('app').service('Perspective', Perspective);

Perspective.$inject = ['HTTPService', 'Image', 'Structure', '$timeout'];

function Perspective(HTTPService, Image, Structure, $timeout) {
	var service = {
		p: {},
		get: function (perspectiveId, getLabel) {
			return HTTPService.get('Perspective', getLabel, perspectiveId).then(
				function (result) {
                    service.set(result[0]);
  					// service.p = result[0];
  					// Image.addImage(service.p.data.image, service.p.data.position_x,
  					// service.p.data.position_y, service.p.data.scale);
       //              Structure.deleteAllStructs(0);
       //  			Structure.addStructure(service.p.data.labels);
  			});
		},
        set: function (pObj) {
            service.p = pObj;
            Image.addImage(pObj.data.image, pObj.data.position_x, 
                pObj.data.position_y, pObj.data.scale);
            Structure.reset();
            Structure.addStructure(pObj.data.labels);
        },
		save: function (ptype) {
            service.p.data.type = ptype;
			service.p.data.position_x = Image.raster.position.x;
        	service.p.data.position_y = Image.raster.position.y;
        	service.p.data.scale = Image.raster.bounds.width/Image.raster.width;
        	Structure.updateStructureData();
        	service.p.data.labels = Structure.structures;
        	console.log(service.p);
        	return HTTPService.save(service.p, 'Perspective', 1).then(
            	function (result) {
                	console.log('Saved');
                	service.p = result.data[0];
                    Image.addImage(service.p.data.image, 
                        service.p.data.position_x, service.p.data.position_y, 
                        service.p.data.scale);
                	Structure.deleteAllStructs(false);
                	Structure.addStructure(service.p.data.labels);
                    console.log('Submit finished (all but trash collect)');
                	if (Structure.trashStruct.length > 0) {
                    	HTTPService.delete('Label', Structure.trashStruct).then(
                        	function (result) {
                            	console.log('Deleted');
                            	Structure.trashStruct = [];
                        });
                	}
        	});
		},
		submit: function (ptype) {
        	if (Image.raster.source.substring(0, 4) == 'blob') {
        		var file = document.getElementById('file').files[0];
            	return HTTPService.img_upload(file, service.p.data.image).then( 
                	function (result) {
                    	if (result.data.old_image_del == 1) {
                        	console.log('Previous image deleted from server');
                        	console.log(result);
                    	}
                    	service.p.data.image = 
                        	'assets/images/' + result.data.file_uploaded;
                        console.log('starting perspective.save');
                    	return service.save(ptype);
                });  
        	} else if (Image.raster.source.substring(0, 4) == 'http') {
         		return service.save(ptype);
			} else {
				console.log('No image supplied');
			}
		},
        delete: function () {
            return HTTPService.delete('Perspective', service.p).then(
                function (result) {
                    console.log('Perspective deleted');
                    Structure.reset();
                });
        }
	};
	return service;
}	