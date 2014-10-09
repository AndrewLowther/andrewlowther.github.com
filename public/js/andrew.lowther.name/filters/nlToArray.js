angular
	.module('app')
	.filter('nlToArray', function() {
		return function(text) {
			return text.split('\n');
		};
	});