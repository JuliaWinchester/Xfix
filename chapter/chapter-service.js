angular.module('app').service('Chapter', Chapter);

Chapter.$inject = ['$rootScope', 'HTTPService'];

function Chapter($rootScope, HTTPService) {
	var service = {
		chapters: [],
		findIndex: function (id, searchArray) {
			var filter = searchArray.filter(function(obj) {
				return obj.data.id == id; });
			if (filter.length > 1) {
				console.log('Duplicate IDs seem to be present?');
				return false; // Better error later
			}
			return searchArray.indexOf(filter[0]);
		},
		addContent: function (content) {
			service.chapters = content;
			$rootScope.$broadcast('chapters.update');
		},
		deleteChapter: function (id) {
			sIndex = service.findIndex(id, service.chapters);
			HTTPService.delete('Chapter', service.chapters[sIndex]).then(
				function (result) {
					if (result.status > 199 && result.status < 300) {
						service.chapters.splice(sIndex, 1);
						$rootScope.$broadcast('chapters.update');
						return result.data;
					} else {
						console.log('Something went wrong deleting chapter.');
					}
				});
		},
		saveChapter: function (obj, sub_layer) {
			var l = typeof sub_layer !== 'undefined' ?  sub_layer : 0;
			
			HTTPService.save(obj, 'Chapter', l).then(
				function (result) {
					if (result.status > 199 && result.status < 300) {
						sIndex = service.findIndex(result.data[0].data.id, service.chapters);
						if (sIndex == -1) {
							service.chapters.push(result.data[0]);
						} else {
							service.chapters[sIndex] = result.data[0];
						}
						$rootScope.$broadcast('chapters.update');
					} else {
						console.log('Something went wrong saving chapter.');
					}
				});
		},
		deleteSpecimen: function (chId, sId) {
			chIndex = service.findIndex(chId, service.chapters);
			sIndex = service.findIndex(sId, service.chapters[chIndex].data.specimens);
			success = HTTPService.delete('Specimen', 
				service.chapters[chIndex].data.specimens[sIndex]);
			if (success) {
				service.chapters[chIndex].data.specimens.splice(sIndex, 1);
				$rootScope.$broadcast('chapters.update');
				return success;
			} else {
				console.log('Error deleting specimen.');
			}	
		},
		reset: function () {
			service.chapters = [];
		}
	};
	return service;
}