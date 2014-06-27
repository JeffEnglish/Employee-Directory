(function() {
  'use strict';

  angular
    .module('app')
    .directive('fileDropzone', ['$parse', directive]);

  function directive($parse) {
    return {
      restrict: 'A',
      scope: true,
      link: link
    };

    function link(scope, element, attrs) {

      (function init() {
        element.bind('dragover', processDragOverOrEnter);
        element.bind('dragenter', processDragOverOrEnter);
        element.bind('drop', processDrop);
      })();

      function getDataTransfer(event) {
        return event.dataTransfer || event.originalEvent.dataTransfer;
      }

      function processDragOverOrEnter(event) {
        if (event) {
          if (event.preventDefault) {
            event.preventDefault();
          }
          if (event.stopPropagation) {
            return false;
          }
        }
        getDataTransfer(event)
          .effectAllowed = 'copy';
        return false;
      };

      function processDrop(event) {
        if (event != null) {
          event.preventDefault();
        }

        setfiles(getDataTransfer(event)
          .files);
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