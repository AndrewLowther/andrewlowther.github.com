angular
	.module('app', [
		'ngRoute',
		'ngAnimate',
		'angular-loading-bar'
	])
	.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = false;
	}]);