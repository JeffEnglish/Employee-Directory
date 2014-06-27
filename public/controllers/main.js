(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', ['$scope', 'Employee', MainCtrl]);

  function MainCtrl($scope, Employee) {
    $scope.alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //BUGBUG: Get this from mongo
    $scope.practices = ['Mobile', 'BI'];
    $scope.headingTitle = "Employees";
    $scope.employees = Employee.query();
    $scope.filterByPractice = function(practice) {
      $scope.employees = Employee.query({
        practice: practice
      });
      $scope.headingTitle = practice;
    };
    $scope.filterByAlphabet = function(char) {
      $scope.employees = Employee.query({
        alphabet: char
      });
      $scope.headingTitle = char;
    };
  }
})();