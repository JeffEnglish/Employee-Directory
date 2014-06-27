(function() {
  'use strict';

  angular
    .module('app')
    .directive('fileButton', ['$parse', 'fileDialog', directive]);

  function directive($parse, fileDialog) {
    return {
      restrict: 'A',
      scope: true,
      /*
          NOTE: In order to allow this directive to work with
          other directives on the same element we cannot define an isoloate scope.
          The solution is to use $parse and call 'model.assign'
          inside of a $scope.apply function. This allows this
          directive to share the 'file' and 'fileName' attributes
          with other directives (e.g. the drop zone directive)
        */
      link: link
    };

    function link(scope, element, attrs, ctrl) {
      (function init() {
        element.bind('click', processClick);
      })();

      function processClick() {
        if (attrs.fileButton === "save") {
          fileDialog.saveAs(setFiles, false, attrs.accept);
        } else {
          fileDialog.openFile(setFiles, false, attrs.accept);
        }
      }

      function checkSize(size) {
        var _ref = attrs.maxFileSize;
        if ((_ref === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
          return true;
        } else {
          alert("File must be smaller than " + attrs.maxFileSize + " MB");
          return false;
        }
      };

      function isTypeValid(type) {
        var _ref = attrs.accept;
        if ((_ref === (void 0) || _ref === '') || (type && _ref.indexOf(type) > -1)) {
          return true;
        } else {
          alert("Invalid file type.  File must be one of following types " + attrs.accept);
          return false;
        }
      };

      function setFiles(files) {
        var file, name, size, type;

        file = files[0];
        name = file.name;
        type = file.type;
        size = file.size;
        if (checkSize(size) && isTypeValid(type)) {
          scope.$apply(function() {
            if (attrs.file) {
              var model = $parse(attrs.file);
              model.assign(scope, file);
            }
            if (attrs.filename) {
              var model = $parse(attrs.filename);
              model.assign(scope, name);
            }
          });
        }
      }
    }
  }
})();