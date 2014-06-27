(function() {
  'use strict';

  angular
    .module('app')
    .controller('NavbarCtrl', ['$scope', 'Auth', NavbarCtrl]);

  function NavbarCtrl($scope, Auth) {
    $scope.logout = function() {
      Auth.logout();
    }
  }
})();