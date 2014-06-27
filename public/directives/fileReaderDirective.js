(function() {
  'use strict';

  angular
    .module('app')
    .directive('fileReader', directive);

  function directive() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    function link(scope, element, attrs, ngModel) {
      (function init() {
        if (!ngModel) return;
        ngModel.$render = function() {}
        scope.$watch(attrs.fileReader, readFile);
      })();

      function readFile(file) {
        if (file && file != '') {
          var reader = new FileReader();
          reader.onload = function(e) {
            //NOTE: MUST CALL $apply TO HAVE 2-WAY DATA BINDING WORK
            scope.$apply(function() {
              ngModel.$setViewValue(e.target.result);
            });
          }
          reader.onerror = function(e) {
            console.log('Error reading file: ', e);
          }
          reader.readAsDataURL(file);
        }
      }
    }
  }

})();