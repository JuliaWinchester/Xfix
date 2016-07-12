angular.module('iconolater').directive('zoomImageIn', zoomImageIn);

zoomImageIn.$inject = ['Image'];

function zoomImageIn(Image) {
	return {
	    restrict: 'A',
	    link: function (scope, element, attrs) {
			function zoomIn () {
		        if (Image.raster) {
		        	Image.raster.scale(1.1);
		        	Image.setCanvasHeight(Image.raster.bounds.height+100, true);
		        	view.draw();
		        }
		    }
	      	element.on('click', zoomIn);
		}
  	};	
}

angular.module('iconolater').directive('zoomImageOut', zoomImageOut);

zoomImageOut.$inject = ['Image'];

function zoomImageOut(Image) {
	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
      		function zoomOut () {
        		if (Image.raster) {
          			Image.raster.scale(0.9);
          			Image.setCanvasHeight(Image.raster.bounds.height+100, true);
          			view.draw();
        		}
      		}
      		element.on('click', zoomOut);
    	}
  	};
}

angular.module('iconolater').directive('centerImage', centerImage);

centerImage.$inject = ['Image'];

function centerImage(Image) {
  return {
      restrict: 'A',
          link: function (scope, element, attrs) {
              function centerImage () {
                    if (Image.raster) {
                        Image.raster.position = view.center;
                        view.draw();
                    }
                }
          element.on('click', centerImage);
        }
    };
}

angular.module('iconolater').directive('addImage', addImage);

addImage.$inject = ['Image'];

function addImage(Image) {
	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
      	function addImage () {
        	Image.addImage(document.getElementById('file').files[0]);
      	}
      	element.on('click', addImage);
    	}
  	};
}

angular.module('iconolater').directive('addStructure', addStructure);

addStructure.$inject = ['Structure', 'Image'];

function addStructure(Structure, Image) {
	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
      		function add () {  
        	  if ((scope.textvar != "") && Image.raster) {
          			Structure.addStructure(scope.textvar);
        		}
      		}

      		if (element.prop('tagName') === 'BUTTON') {
        		element.on('click', add);
      		} else if (element.prop('tagName') === 'INPUT') {
        		element.bind('keydown', function(event) {
          			if (event.which === 13) { add(); }
        		}); 
      		}
    	}
  	};
}

angular.module('iconolater').directive('deleteOneStructure', deleteOneStructure);

deleteOneStructure.$inject = ['Structure'];

function deleteOneStructure(Structure) {
	return {
    	restrict: 'A',
    	scope: {
      		itemid: '='
    	},
    	link: function(scope, element, attrs) {
     		function deleteOneStruct () {
        		Structure.deleteStructureArray([scope.itemid]);
        		console.log('baleeted');
      		}
      		element.on('click', deleteOneStruct);
    	}
  	};
}

angular.module('iconolater').directive('deleteStructure', deleteStructure);

deleteStructure.$inject = ['Structure'];

function deleteStructure(Structure) {
	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
      		function deleteStruct () {
        		if (scope.selectedStructures) {
          			Structure.deleteStructureArray(scope.selectedStructures); 
        		}
      		}		   
      	element.on('click', deleteStruct);
    	}
  	};
}

angular.module('iconolater').directive('drawEdit', drawEdit);

function drawEdit() {
	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
      		function init() {
        		paper.install(window);
        		paper.setup(element[0]);
      		}

      		init();
      		var tool = new Tool;
      		uiDrag(tool);
      		view.draw();
    	}
  	};
}

angular.module('iconolater').directive('drawNoEdit', drawNoEdit);

function drawNoEdit() {
  return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            function init() {
                paper.install(window);
                paper.setup(element[0]);
            }

            init();
            view.draw();
        }
    };
}
