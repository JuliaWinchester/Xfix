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
	      if (arrayOfObjs[index].labelPath) {
	        arrayOfObjs[index].labelPath.group.remove();
	      }
	      if (index > -1) {
	        arrayOfObjs.splice(index, 1);
	      }
	    },
	    addStructure: function (structName) {
	      service.structures.push({id: service.structNum, text: structName});
	      service.structLabels.push({id: service.structNum, labelPath: new labelPath(structName, [100, 100], [200, 200])});
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
	      service.findDestroy(service.structLabels, structID);
	    } 
  	}
  	return service;
}

angular.module('iconolater').service('Image', CanvasImage);

function CanvasImage() { // Function name avoids PaperJS conflict
  	var service = {
	    raster: null,
	    addImage: function(imageBlobURL) {
	      	if (service.raster) { service.raster.remove(); }
	      	service.raster = new Raster(imageBlobURL);
	      	view.draw();
	    }
	}
	return service;
}

angular.module('iconolater').service('Canvas', CanvasFrame);

CanvasFrame.$inject = ['Image'];

function CanvasFrame(Image) { // Function name avoids PaperJS conflict
	var service = {
	    repositionImage: function(initHeight, newHeight) {
	      var initRasterY = Image.raster.position.y;
	      var initRelPos = initRasterY/initHeight;
	      Image.raster.position.y = initRelPos*view.size.height;
	    },
	    resizeCanvasHeight: function(newHeight) {
	      if (newHeight < 183) {
	        newHeight = 183;
	      }
	      else {
	        newHeight = Math.round(newHeight);
	      }
	      var initHeight = view.size.height;
	      var ctx = document.getElementById("canvas").getContext("2d");
	      ctx.canvas.height = newHeight;
	      var toolbar = document.getElementById("nav");
	      var toolHeight = newHeight - 183.0;
	      toolbar.style.paddingBottom = (newHeight-183.0) + "px";
	      view.viewSize = [ctx.canvas.width, newHeight];
	      if (Image.raster) { service.repositionImage(initHeight, newHeight); }
	    }
  	}
  return service;
}

