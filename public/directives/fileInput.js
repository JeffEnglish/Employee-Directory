(function x() {
  'use strict';

  angular
    .module('app')
    .directive('fileInput', ['$parse', directive]);

  function directive($parse) {
    return {
      restrict: 'EA',
      template: '<input type="file" />',
      replace: true,
      link: link
    };

    function link(scope, element, attrs) {
      (function init() {
        element.bind('change', updateModel);
      })();

      function updateModel() {
        var model = $parse(attrs.fileInput);
        var onChange = $parse(attrs.onChange);
        scope.$apply(function() {
          model.assign(scope, element[0].files[0]);
          onChange(scope);
        });
      }
    }
  }
})();