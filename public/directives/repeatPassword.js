(function() {
  'use strict';

  angular
    .module('app')
    .directive('repeatPassword', directive);

  function directive() {
    return {
      require: 'ngModel',
      link: link
    };

    function link(scope, element, attrs, ngModel) {
      var otherInput = elem.inheritedData('$formController')[attrs.repeatPassword];

      ngModel.$parsers.push(function(value) {
        if (value === otherInput.$viewValue) {
          ngModel.$setValidity('repeat', true);
          return value;
        }
        ngModel.$setValidity('repeat', false);
      });

      otherInput.$parsers.push(function(value) {
        ngModel.$setValidity('repeat', value === ngModel.$viewValue);
        return value;
      });
    }
  }
})();