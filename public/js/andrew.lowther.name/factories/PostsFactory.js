function PostsFactory ($http) {
	var PostsFactory = {};

	PostsFactory.data = {
		loadedPost: null
	};

	PostsFactory.getAllPosts = function () {
		return PostsFactory.data.loadedPost = $http({
			method: "GET",
			url: "data/posts/all-posts.json"
		});
	}

	return PostsFactory;
}

angular
	.module('app')
	.factory('PostsFactory', PostsFactory);