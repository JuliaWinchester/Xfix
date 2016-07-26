angular.module('iconolater').service('Structure', Structure);

Structure.$inject = ['$rootScope'];

function Structure($rootScope) {
	var service = {
    	structNum: 0,
    	structures: [],
    	trashStruct: [],
	    findIndex: function (arrayOfObjs, ObjID) {
	      	var result = arrayOfObjs.filter(function(obj) {
	        	return obj.sNum == ObjID; })[0];
	      	return arrayOfObjs.indexOf(result);
	    },
	    addStructure: function (struct) {
	    	pushStr = function (struct) {
	    		if (typeof struct == 'string') {
	    			service.structures.push({
	    				sNum: service.structNum, 
	    				name: struct, 
	    				labelPath: new labelPath(struct, [100,100], [200,200]),
	    				data: {id: null, name: struct, label_position_x: 100,
	    					label_position_y: 100, arrow_position_x: 200,
	    					arrow_position_y: 200, perspective_id: null, 
	    					item_id: null, save_fields: ['name', 
	    					'label_position_x', 'label_position_y',
                    		'arrow_position_x', 'arrow_position_y', 
                    		'perspective_id','item_id']}
	    			});
	    			$rootScope.$broadcast('structures.update');
	    			service.structNum += 1;
	    		} else if (typeof struct == 'object') {
	    			struct.sNum = service.structNum;
	    			struct.name = struct.data.name;
	    			var lPos = struct.data.label_position_x && 
	    				struct.data.label_position_y ? 
	    				[struct.data.label_position_x, 
	    				struct.data.label_position_y] : [100, 100];
	    			var aPos = struct.data.arrow_position_x && 
	    				struct.data.arrow_position_y ? 
	    				[struct.data.arrow_position_x, 
	    				struct.data.arrow_position_y] : [200, 200];
	    			struct.labelPath = new labelPath(struct.name, lPos, aPos);
	    			service.structures.push(struct);
	    			$rootScope.$broadcast('structures.update');
	    			service.structNum += 1;
	    		}
	    		view.draw();
	    	};

	    	if (Array.isArray(struct)) {
	    		for (var i = 0; i < struct.length; i++) {
	    			pushStr(struct[i]);
	    		}
	    	} else {
	    		pushStr(struct);
	    	}
	    },
	    updateStructureData: function () {
	    	for (var i = 0; i < service.structures.length; i++) {
	    		var struct = service.structures[i];
	    		struct.data.label_position_x = 
	    			struct.labelPath.label.point.x;
                struct.data.label_position_y = 
                	struct.labelPath.label.point.y;
                struct.data.arrow_position_x = 
                	struct.labelPath.pathGroup.getEndPoint().x;
                struct.data.arrow_position_y = 
                	struct.labelPath.pathGroup.getEndPoint().y;
	    	}
	    },
	    deleteStructureArray: function (structs) {
	      if (structs.length > 0) {
	        for (var i = 0; i < structs.length; i++) {
	          service.deleteStructure(structs[i]);
	        }
	        $rootScope.$broadcast('structures.update');
	        view.draw();
	      } 
	    },
	    deleteStructure: function (structID) {
	      var index = service.findIndex(service.structures, structID);
	      if (index > -1) {
	      		service.trashStruct.push(service.structures[index]);
	      		service.structures[index].labelPath.group.remove();
	        	service.structures.splice(index, 1);
	      	}
	    },
	    deleteAllStructs: function (trashAll) {
	    	if (trashAll) {
	    		service.trashStruct = 
	    			service.trashStruct.concat(service.structures);
	    	}
	    	for (var i = 0; i < service.structures.length; i++) {
	    		service.structures[i].labelPath.group.remove();
	    	}
	    	service.structures = [];
	    	$rootScope.$broadcast('structures.update');
	    	view.draw();
	    }
  	};
  	return service;
}

angular.module('iconolater').service('Image', CanvasImage);

function CanvasImage() { // Function name avoids PaperJS conflict
  	var service = {
	    raster: null,
	    addImage: function(src, x, y, scale) {
	    	if (typeof src != 'string') { src = URL.createObjectURL(src); }
	      	if (service.raster) { service.raster.remove(); }
	      	service.raster = new Raster(src);
	      	service.raster.onLoad = function () {
	      		service.raster.sendToBack();
				if (x && y && scale) {
		      		service.raster.position = [x, y];
		      		service.raster.scale(scale);
		      		service.setCanvasHeight(service.raster.bounds.height+100, false);
		      	} else {
	         		console.log('No x, y, or scale; setting up new image');
		      		service.setupNewImage();
		      		service.setCanvasHeight(service.raster.bounds.height+100, true);	      		
		      	}
		      	view.draw();
	      	};
	    },
	    setupNewImage: function() {
	    	var ctx = document.getElementById("i-ctx").getContext("2d");
	    	service.raster.scale((ctx.canvas.width - 100)/service.raster.width);
	    	service.raster.position = view.center;
	    },
	    setCanvasHeight: function(newHeight, moveRaster) {
	      	if (newHeight < 183) {
	        	newHeight = 183;
	      	} else {
	        	newHeight = Math.round(newHeight);
	      	}
	      	
	      	var initHeight = view.size.height;
	      	var ctx = document.getElementById("i-ctx").getContext("2d");
	      	ctx.canvas.height = newHeight;
	      	console.log('By this point canvas height should be');
	      	console.log(newHeight);
	      	console.log('Canvas height is actually:');
	      	console.log(ctx.canvas.height);

	      	if (document.getElementById("nav")) {
	      		var toolbar = document.getElementById("nav");
	      		var toolHeight = newHeight - 183.0;
	      		toolbar.style.paddingBottom = (newHeight-183.0) + "px";
	      	}
	      	
	      	view.viewSize = [ctx.canvas.width, newHeight];
	      	
	      	if (service.raster && moveRaster) { 
	      		var initRasterY = service.raster.position.y;
	      		var initRelPos = initRasterY/initHeight;
	      		service.raster.position.y = initRelPos*view.size.height; 
	      	}
	    }
	};
	return service;
}