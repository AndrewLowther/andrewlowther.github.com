function PostsCtrl ($$getPost) {
	var vm = this;
	vm.post = $$getPost.data;
}

PostsCtrl.resolve = {
	"$$getPost": function ($route, PostsFactory) {
		return PostsFactory.getPost($route.current.params.id);
	}
}

angular
	.module('app')
	.controller('PostsCtrl', PostsCtrl);