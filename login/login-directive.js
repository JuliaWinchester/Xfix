angular.module('app').directive('logout', logout);

logout.$inject = ['LogInService'];

function logout(LogInService) {
	return {
	    restrict: 'A',
	    link: function (scope, element, attrs) {
			function logout () {
				console.log('logging out');
		        LogInService.logout();
		    }
	      	element.on('click', logout);
		}
  	};	
}