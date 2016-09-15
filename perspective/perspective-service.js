angular.module('app').service('Perspective', Perspective);

Perspective.$inject = ['HTTPService', 'Image', 'Structure', 'QuizService'];

function Perspective(HTTPService, Image, Structure, QuizService) {
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
        },
        initQuiz: function () {
            QuizService.initQuiz();
        },
        endQuiz: function () {
            QuizService.endQuiz();
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
        topText: null,
        cleanUp: function () {
            service.nCorrect = 0;
            for (var i = 0; i < service.labels.length; i++) {
                service.labels[i].answerText.frame.remove();
                service.labels[i].answerText.remove();
            }
            service.labels = [];
            if (service.labelBox) { service.labelBox.remove(); };
            if (service.nCorrectText) { service.nCorrectText.remove(); };
            if (service.topText) { service.topText.remove(); };
            for (var i = 0; i < Structure.structures.length; i++) {
                Structure.structures[i].labelPath.label.visible = true;
                if (Structure.structures[i].labelPath.hasOwnProperty('questionFrame')) {
                    Structure.structures[i].labelPath.questionFrame.remove();
                }
            }
        },
        initQuiz: function () {
            service.cleanUp();
            service.drawQuiz();
            service.dragOn();
            view.draw();
        },
        drawQuiz: function () {
            Image.setCanvasWidth(1200);
            var ctxDims = Image.getCanvasDims();
            service.labelBox = new Path.Rectangle(new Point(920, 60), new Point(1180, ctxDims.height-20));
            service.labelBox.fillColor = '#009688';
            service.labelBox.shadowColor = 'white';
            service.labelBox.shadowBlur = 3;
            service.nCorrectText = new PointText({
                point: new Point(service.labelBox.bounds.left + 55, 
                    service.labelBox.bounds.top - 10),
                content: service.nCorrect+'/'+Structure.structures.length+' correctly placed',
                fillColor: 'white',
                fontFamily: 'Helvetica',
                fontSize: '16px',
                shadowColor: 'black',
                shadowBlur: 4
            });
            service.topText = new PointText({
                point: new Point(service.labelBox.bounds.left + 15, 
                    service.labelBox.bounds.top - 35),
                content: 'Drag labels to appropriate boxes',
                fillColor: 'white',
                fontFamily: 'Helvetica',
                fontSize: '16px',
                shadowColor: 'black',
                shadowBlur: 4
            });

            // Drawing answer labels and erasing canvas labels
            for (var i = 0; i < Structure.structures.length; i++) {
                    var lp = Structure.structures[i].labelPath;
                    var l = lp.label;
                    var p = lp.pathGroup.children['path'];
                    l.visible = false;
                    var qf = new Path.Rectangle({
                        point: [p.getPointAt(0).x-10, p.getPointAt(0).y-10],
                        size: [20, 20],
                        fillColor: '#26a69a',
                        opacity: 0.75,
                        name: 'questionFrame'
                    });
                    Structure.structures[i].labelPath.questionFrame = qf;
                    service.labels.push({text: l.content, width: l.bounds.width});
            }

            var shuffle = function (array) {
                var m = array.length, i, t;
                while (m) {
                    i = Math.floor(Math.random() * m--);
                    t = array[m];
                    array[m] = array[i];
                    array[i] = t;
                }
                return array;
            };

            service.labels = shuffle(service.labels);
            var ansX = service.labelBox.bounds.left+10;
            var ansY = service.labelBox.bounds.top+30;
            var ansXFinal = service.labelBox.bounds.right-10;
            var ansYFinal = service.labelBox.bounds.bottom-60;
            for (var i = 0; i < service.labels.length; i++) {
                if (service.labels[i].width + ansX > ansXFinal) {
                    ansY += 30;
                    if (ansY > ansYFinal) {
                        // Expand canvas+view, labelBox, bottomText
                    }
                    ansX = service.labelBox.bounds.left+10;
                }
                service.labels[i].answerText = new PointText({
                    point: new Point(ansX, ansY),
                    content: service.labels[i].text,
                    fillColor: 'white',
                    fontFamily: 'Helvetica',
                    fontSize: '16px',
                    name: 'answer'
                });
                service.labels[i].answerText.frame = new Path.Rectangle({
                    from: [service.labels[i].answerText.bounds.left-4,
                        service.labels[i].answerText.bounds.top-2],
                    to: [service.labels[i].answerText.bounds.right+4,
                        service.labels[i].answerText.bounds.bottom],
                    fillColor: '#004d40',
                    shadowColor: 'gray',
                    shadowBlur: 3
                }).insertBelow(service.labels[i].answerText);
                
                ansX = ansX + service.labels[i].width + 15;
            }
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
                service.tool.item = null;
                var hitResult = project.hitTest(event.point, hitOptions);
                if (hitResult.item.name == 'answer') {
                    service.tool.item = hitResult.item;
                    service.tool.item.frame.strokeWidth = 0;
                }
            };

            service.tool.onMouseDrag = function(event) {
                service.tool.item.position = 
                    service.tool.item.position.add(event.delta);
                service.tool.item.frame.position = service.tool.item.position;
            };

            service.tool.onMouseUp = function(event) {
                for (var i = 0; i < Structure.structures.length; i++) {
                    var lp = Structure.structures[i].labelPath;
                    if (service.tool.item.frame.intersects(lp.questionFrame) || 
                        service.tool.item.frame.contains(lp.questionFrame.position)) {
                        service.tool.item.position = lp.questionFrame.position;
                        service.tool.item.frame.position = 
                            lp.questionFrame.position;
                        if (service.tool.item.content == lp.label.content) {
                            service.tool.item.frame.strokeColor = '#e0f2f1';
                            service.tool.item.frame.strokeWidth = 2;
                            service.tool.item.name = 'answerLocked';
                            service.nCorrect++;
                            service.nCorrectText.content = 
                                service.nCorrect+ '/' + 
                                Structure.structures.length+ 
                                ' correctly placed';
                        } else {
                            service.tool.item.frame.strokeColor = '#b71c1c';
                            service.tool.item.frame.strokeWidth = 2;
                        }
                    }       
                }
            };

            //uiDrag(tool);
        },
        endQuiz: function () {
            Image.setCanvasWidth(900);
            service.cleanUp();
            view.draw();
        }
    };
    return service;
}