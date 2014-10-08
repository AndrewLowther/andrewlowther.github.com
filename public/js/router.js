function Router($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'public/views/index.html',
			controller: 'IndexCtrl as vm',
			resolve: IndexCtrl.resolve
		});
};

angular
	.module('app')
	.config(Router);