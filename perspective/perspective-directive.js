angular.module('app').directive('customOnChange', customOnChange);

function customOnChange () {
    return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', function(event){
		var files = event.target.files;
		onChangeFunc(files);
      });
        
      element.bind('click', function(){
      	element.val('');
      });
    }
  };
}