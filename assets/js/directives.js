myApp.directive('fileInputOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.fileInputOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});