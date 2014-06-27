/*jshint undef: true, unused: true, browser: true */
/*global angular: true, FileReader: true */
/*jslint browser: true, white: true, indent: 2 */

/*
    Credit: http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx
};
*/
(function() {
  'use strict';

  function factory($q) {

    function onLoad(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.resolve(reader.result);
        });
      };
    }

    function onError(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.reject(reader.result);
        });
      };
    }

     /*jslint unparam: true*/
    function onProgress(reader, scope) {
      return function(event) {
        scope.$broadcast('fileProgress', {
          total: event.total,
          loaded: event.loaded
        });
      };
    }
    /*jslint unparam: false*/

    function getReader(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    }

    function readAsDataURL(file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    }

    function readAsText(file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsText(file);

      return deferred.promise;
    }

    return {
      readAsDataUrl: readAsDataURL,
      readAsText: readAsText
    };
  }

  angular
    .module('app')
    .factory('fileReader', ['$q', factory]);
}());