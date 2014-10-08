function IndexCtrl ($$getAllPosts) {
	var vm = this;
	vm.posts = $$getAllPosts.data;
}

IndexCtrl.resolve = {
	"$$getAllPosts": function (PostsFactory) {
		return PostsFactory.getAllPosts();
	}
}

angular
	.module('app')
	.controller('IndexCtrl', IndexCtrl);