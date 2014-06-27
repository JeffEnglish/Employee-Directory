// Use an IIFE to scope the implementation and avoid any global scope collisions that
// might occur now or if this is used in another application.
(function() {
  'use strict';

  angular
    .module('app')
    .controller('AddCtrl', ['$scope', '$alert', '$http', 'Employee', AddCtrl]);

  function AddCtrl($scope, $alert, $http, Employee) {
    $scope.employee = {};
    $scope.photoFile = {};
    $scope.myText = '';

    $scope.$on("fileProgress", function(e, progress) {
      console.log('Progress:', progress);
        $scope.progress = progress.loaded / progress.total;
    });

    $scope.addEmployee = function() {
      Employee.save($scope.employee,
        function() {
          $scope.employee = {}
          $scope.addForm.$setPristine();
          $alert({
            content: 'Employee has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.employee = {}
          $scope.addForm.$setPristine();
          $alert({
            content: response.data.message,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
  }

})();