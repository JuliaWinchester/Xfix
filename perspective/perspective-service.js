angular.module('app').service('Perspective', Perspective);

Perspective.$inject = ['HTTPService', 'Image', 'Structure'];

function Perspective(HTTPService, Image, Structure) {
	var service = {
		p: {},
		get: function (perspectiveId, getLabel) {
			return HTTPService.get('Perspective', getLabel, perspectiveId).then(
				function (result) {
                    service.set(result[0]);
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
        },
        toggleLabels: function () {
            Structure.toggleLabels();
        }
	};
	return service;
}

angular.module('app').service('QuizService', QuizService);

QuizService.$inject = ['Image', 'Structure'];

function QuizService(Image, Structure) {
    var service = {
        quizEnabled: false,
        labelBox: null,
        labels: [],
        nCorrect: 0,
        nCorrectText: null,
        enable: function () {
            service.drawQuiz();
            service.dragOn();
            view.draw();
        },
        drawQuiz: function () {
            Image.setCanvasWidth(1400);
            var ctxDims = Image.getCanvasDims();
            service.labelBox = new Rectangle(950, 50, 1350, ctxDims.height-50);
            var labelXY; // Write code to give evenly spaced grid locs for n structures
            for (var i = 0; i < Structure.structures.length; i++) {
                Structure.structures[i].labelPath.label.visible = false;
                // Code to draw box on old labels
                var label = new Text(labelX[i].x, labelY[i].y, 
                    Structure.structures[i].labelPath.label.text);
                // Code to draw label borders or background
                labels.push(label);
            }
            service.nCorrectText = new Text(labelBox.bbox.center, 
                labelBox.bbox.bottom - 40, 
                nCorrect+'/'+service.labels.length+' correctly placed');
        },
        dragOn: function () {
            service.tool = new Tool(); // After this, add event functions to tool

            var hitOptions = {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5
            };

            service.tool.onMouseDown = function(event) {
                project.activeLayer.selected = false;
                service.tool.item = null;

                var hitResult = project.hitTest(event.point, hitOptions);
                if (!hitResult || hitResult.item != label || service.labels.findIndex(hitResult.item) == -1) {
                    return;
                }
                service.tool.item = hitResult.item;
                service.tool.item.box.selected = true;
                service.tool.mouseStart = event.point;
            };

            service.tool.onMouseDrag = function(event) {
                service.tool.item.position = 
                    service.tool.item.position.add(event.delta);
                service.tool.item.box.position = 
                    service.tool.item.box.position.add(event.delta);
            };

            service.tool.onMouseUp = function(event) {
                // Where ~the magic~ happens
            };
        },
        disable: function () {

        }
    };
    return service;
}