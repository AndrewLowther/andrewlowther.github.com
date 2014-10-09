function Router($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'public/views/index.html',
			controller: 'IndexCtrl as vm',
			resolve: IndexCtrl.resolve
		})
		.when('/posts/:id', {
			templateUrl: 'public/views/post.html',
			controller: 'PostsCtrl as vm',
			resolve: PostsCtrl.resolve
		})
		.otherwise({
			redirectTo: '/'
		});
};

angular
	.module('app')
	.config(Router);