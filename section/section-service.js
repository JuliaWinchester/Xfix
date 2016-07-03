angular.module('app').service('Section', Section);

Section.$inject = ['$rootScope', 'HTTPService'];

function Section($rootScope, HTTPService) {
	var service = {
		sections: [],
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
			service.sections = content;
			$rootScope.$broadcast('sections.update');
		},
		deleteSection: function (id) {
			sIndex = service.findIndex(id, service.sections);
			HTTPService.delete('Section', service.sections[sIndex]).then(
				function (result) {
					if (result.status > 199 && result.status < 300) {
						service.sections.splice(sIndex, 1);
						$rootScope.$broadcast('sections.update');
						return result.data;
					} else {
						console.log('Something went wrong deleting section.');
					}
				});
		},
		saveSection: function (obj, sub_layer) {
			var l = typeof sub_layer !== 'undefined' ?  sub_layer : 0;
			
			HTTPService.save(obj, 'Section', l).then(
				function (result) {
					if (result.status > 199 && result.status < 300) {
						sIndex = service.findIndex(result.data[0].data.id, service.sections);
						if (sIndex == -1) {
							service.sections.push(result.data[0]);
						} else {
							service.sections[sIndex] = result.data[0];
						}
						$rootScope.$broadcast('sections.update');
					} else {
						console.log('Something went wrong saving section.');
					}
				});
		},
		deleteModel: function (sId, mId) {
			sIndex = service.findIndex(sId, service.sections);
			mIndex = service.findIndex(mId, service.sections[sIndex].data.models);
			success = HTTPService.delete('Model', 
				service.sections[sIndex].data.models[mIndex]);
			if (success) {
				service.sections[sIndex].data.models.splice(mIndex, 1);
				$rootScope.$broadcast('sections.update');
				return success;
			} else {
				console.log('Error deleting model.');
			}	
		}
	};
	return service;
}