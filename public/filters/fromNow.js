(function() {
	angular
		.module('app')
		.filter('fromNow', filter);

	function filter() {
		return function(date) {
			return moment(date).fromNow();
		}
	}
})();