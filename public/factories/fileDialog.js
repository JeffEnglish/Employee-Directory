/*jshint undef: true, unused: true, browser: true */
/*global angular: true */
/*jslint browser: true, white: true, indent: 2 */

/* 
  Credit: https://github.com/DWand/nw-fileDialog
*/
(function() {
  'use strict';

  function factory() {

    function callDialog(dialog, callback) {
      dialog.addEventListener('change', function(evt) {
        callback(evt.target.files);
      }, false);
      dialog.click();
    }

    function saveAs(callback, defaultFilename, acceptTypes) {
      var dialog = document.createElement('input');
      dialog.type = 'file';
      dialog.nwsaveas = defaultFilename || '';
      if (angular.isArray(acceptTypes)) {
        dialog.accept = acceptTypes.join(',');
      } else if (angular.isString(acceptTypes)) {
        dialog.accept = acceptTypes;
      }
      callDialog(dialog, callback);
    }

    function openFile(callback, multiple, acceptTypes) {
      var dialog = document.createElement('input');
      dialog.type = 'file';
      if (multiple === true) {
        dialog.multiple = 'multiple';
      }
      if (angular.isArray(acceptTypes)) {
        dialog.accept = acceptTypes.join(',');
      } else if (angular.isString(acceptTypes)) {
        dialog.accept = acceptTypes;
      }
      callDialog(dialog, callback);
    }

    function openDir(callback) {
      var dialog = document.createElement('input');
      dialog.type = 'file';
      dialog.nwdirectory = 'nwdirectory';
      callDialog(dialog, callback);
    }

    return {
      saveAs: saveAs,
      openFile: openFile,
      openDir: openDir
    };
  }

  angular
    .module('app')
    .factory('fileDialog', factory);
}());