/*jshint undef: true, unused: true, browser: true */
/*global angular: true, alert: true */
/*jslint browser: true, white: true, indent: 2 */

/* 
  Credit: 
    http://buildinternet.com/2013/08/drag-and-drop-file-upload-with-angularjs/ 
    https://github.com/onemightyroar/angular-file-dnd
*/
(function() {
  'use strict';

  function directive(fileDialog, fileReader) {

    function link(scope, element, attrs) {
      function setContents(value) {
        scope.contents = value;
      }

      function checkSize(size) {
        var _ref = attrs.maxFileSize;
        if ((_ref === undefined || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
          return true;
        }
        alert('File must be smaller than ' + attrs.maxFileSize + ' MB');
        return false;
      }

      function isTypeValid(type, silent) {
        var _ref = attrs.accept;
        if (_ref === undefined || _ref === '') {
          return true;
        }
        var aTypes = attrs.accept.split(',');
        var i, MIMEtype;
        for (i = 0; i < aTypes.length; i++) {
          MIMEtype = new RegExp(aTypes[i].replace('*', '.*'), 'i');
          if (MIMEtype.test(type)) {
            return true;
          }
        }
        if (!silent) {
          alert('Invalid file type.  File must be one of following types ' + attrs.accept);
        }
        return false;
      }

      function setFile(files) {
        var file, size, type;

        file = files[0];
        type = file.type;
        size = file.size;
        if (checkSize(size) && isTypeValid(type)) {
          scope.$apply(function() {
            scope.file = file;
            if (attrs.contents) {
              // Track file progress; progress has 2 properties: 'loaded' and 'total'
              /*jslint unparam: true*/
              scope.$on('fileProgress', function(e, progress) {
                scope.progress = progress;
              });
              /*jslint unparam: false*/
              if (type.match(/^image/)) {
                fileReader.readAsDataUrl(file, scope)
                  .then(setContents);
              } else if (type.match(/^text/)) {
                fileReader.readAsText(file, scope)
                  .then(setContents);
              }
            }
          });
        }
      }

      function processClick() {
        if (attrs.click === 'save') {
          fileDialog.saveAs(setFile, false, attrs.accept);
        } else {
          fileDialog.openFile(setFile, false, attrs.accept);
        }
      }

      function getDataTransfer(event) {
        return event.dataTransfer || event.originalEvent.dataTransfer;
      }

      function processDragEnter(event) {
        if (event) {
          // Determine if the item being dragged over this element is allowed to be dropped
          var dataTransfer = getDataTransfer(event);
          // Google Chrome
          if (dataTransfer.items) {
            if (isTypeValid(dataTransfer.items[0].type, true)) {
              element.addClass('dragOver-valid');
            } else {
              element.addClass('dragOver-invalid');
            }
          } else {
            element.addClass('dragOver-valid');
          }
        }
      }

      function processDragOver(event) {
        event.preventDefault();
      }

      function processDragLeave() {
        element.removeClass('dragOver-valid dragOver-invalid');
      }

      function processDrop(event) {
        processDragLeave();
        if (event) {
          event.preventDefault();
          event.stopPropagation();
          setFile(getDataTransfer(event)
            .files);
        }
      }

      (function init() {
        if (attrs.noClick === undefined) {
          element.bind('click', processClick);
        }

        if (attrs.noDrop === undefined) {
          element.bind('dragenter', processDragEnter)
            .bind('dragover', processDragOver)
            .bind('dragleave', processDragLeave)
            .bind('drop', processDrop);
        }
      }());
    }

    return {
      restrict: 'E',
      scope: {
        file: '=?', // optional
        contents: '=?', // optional
        progress: '=?'
      },
      template: '<div ng-transclude></div>',
      transclude: true,
      replace: true,
      link: link
    };
  }

  angular.module('app')
    .directive('fileTarget', ['fileDialog', 'fileReader', directive]);
}());