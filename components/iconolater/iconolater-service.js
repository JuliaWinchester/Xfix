angular.module('iconolater').service('Structure', Structure);

Structure.$inject = ['$rootScope'];

function Structure($rootScope) {
	var service = {
    	structNum: 0,
    	structures: [],
    	structLabels: [],
	    findDestroy: function (arrayOfObjs, ObjID) {
	      	var result = arrayOfObjs.filter(function(obj) {
	        	return obj.id == ObjID; })[0];
	      	var index = arrayOfObjs.indexOf(result);
	      	if (index > -1) {
	      		arrayOfObjs[index].labelPath.group.remove();
	        	arrayOfObjs.splice(index, 1);
	      	}
	    },
	    addStructure: function (name, dbID, labelX, labelY, arrowX, arrowY) {
	    	var dbID = typeof dbID !== 'undefined' ?  dbID : null;
	    	var lPos = labelX && labelY ? [labelX, labelY] : [100, 100];
	    	var aPos = arrowX && arrowY ? [arrowX, arrowY] : [200, 200];
	      	service.structures.push({id: service.structNum, text: name, 
	      		dbID: dbID, labelPath: new labelPath(name, lPos, aPos)});
	      	$rootScope.$broadcast('structures.update');
	      	service.structNum += 1;
	      	view.draw();
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
	      service.findDestroy(service.structures, structID);
	    } 
  	}
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
	      	if (x && y && scale) {
	      		service.raster.position = [x, y];
	      		service.raster.scale(scale);
	      	} else {
	      		service.setupNewImage();
	      	}
	      	service.resizeCanvasHeight(service.raster.bounds.height+100);
	      	view.draw();
	    },
	    setupNewImage: function() {
	    	var ctx = document.getElementById("canvas").getContext("2d");
	    	service.raster.scale((ctx.canvas.width - 100)/service.raster.width);
	    	service.raster.position = view.center;
	    },
	    repositionImage: function(initHeight, newHeight) {
	      	var initRasterY = service.raster.position.y;
	      	var initRelPos = initRasterY/initHeight;
	      	service.raster.position.y = initRelPos*view.size.height;
	    },
	    resizeCanvasHeight: function(newHeight) {
	      	if (newHeight < 183) {
	        	newHeight = 183;
	      	} else {
	        	newHeight = Math.round(newHeight);
	      	}
	      	var initHeight = view.size.height;
	      	var ctx = document.getElementById("canvas").getContext("2d");
	      	ctx.canvas.height = newHeight;
	      	var toolbar = document.getElementById("nav");
	      	var toolHeight = newHeight - 183.0;
	      	toolbar.style.paddingBottom = (newHeight-183.0) + "px";
	      	view.viewSize = [ctx.canvas.width, newHeight];
	      	if (service.raster) { 
	      		service.repositionImage(initHeight, newHeight); 
	      	}
	    }
	}
	return service;
}