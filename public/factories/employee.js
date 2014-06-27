(function() {
  'use strict';

  angular
    .module('app')
    .factory('Employee', ['$resource', factory]);

  function factory($resource) {
    return $resource('/api/employees/:_id');
  }
})();