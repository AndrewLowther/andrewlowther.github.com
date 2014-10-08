function Router($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'public/views/index.html',
			controller: 'IndexCtrl as vm',
			resolve: IndexCtrl.resolve
		})
		.otherwise({
			redirectTo: '/'
		});
};

angular
	.module('app')
	.config(Router);