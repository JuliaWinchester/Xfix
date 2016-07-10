angular.module('app').service('HTTPService', HTTPService);

HTTPService.$inject = ['$http'];

function HTTPService($http) {
	var service = {
		get: function (type, sub_layer, id, match_perspective_id) {
			var t = typeof type !== 'undefined' ?  type : null;
			var s = typeof sub_layer !== 'undefined' ?  sub_layer : 0;
			var i = typeof id !== 'undefined' ?  id : null;
			var m_id = 
				typeof match_perspective_id !== 'undefined' ?  match_perspective_id : null;

			var config = {params: 
				{type: t, sub_layer: s, id: i, match_perspective_id: m_id}};
			return $http.get('backend/php/query.php', config).then(
				function successCallback(response) {
					console.log(response);
					return response.data;
				}, 
				function errorCallback(response) {
					service.handleError(response);
				});
		},
		save: function (obj, type, sub_layer) {
			var o = typeof obj !== 'undefined' ?  obj : null;
			var t = typeof type !== 'undefined' ?  type : null;
			var s = typeof sub_layer !== 'undefined' ?  sub_layer : 0;
			var config = {params: {mode: 'save', type: t, sub_layer: s}};
			return $http.post('backend/php/post.php', {obj: o}, config).then(
				function successCallback(response) {
					console.log(response);
					return response;
				},
				function errorCallback(response) {
					service.handleError(response);
				});
		},
		delete: function (type, obj) {
			var t = typeof type !== 'undefined' ?  type : null;
			var o = typeof obj !== 'undefined' ?  obj : null;

			var config = {params: {mode: 'delete', type: t}};
			return $http.post('backend/php/post.php', {obj: o}, config).then(
				function successCallback(response) {
					console.log(response);
					return response;
				},
				function errorCallback(response) {
					service.handleError(response);
				});
		},
		img_upload: function (file, old_image) {
			var myFormData = new FormData();
        	myFormData.append('file', file);
        	config = {headers: {'Content-Type': undefined}, 
            params: {old_image: old_image}};
        	return $http.post('backend/php/upload.php', myFormData, config).then(
            	function successCallback(response) { 
              		console.log(response); 
              		return response; 
              	},
            	function errorCallback(response) { 
            		service.handleError(response); 
            	});
		},
		handleError: function (response) {
			console.log('Error in HTTP query or post!');
			console.log('HTTP Status Text: ' + response.statusText);
			console.log('HTTP Status: ' + response.status);
			console.log('Transmitted configuration object:');
			console.log(response.config);
			console.log('Returned data object (if present):');
			console.log(response.data);
		}
	};
	return service;
}

