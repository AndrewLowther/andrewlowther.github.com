function PostsFactory ($http) {
	var PostsFactory = {};

	PostsFactory.data = {
		loadedPosts: null,
		loadedPost: null
	};

	PostsFactory.getAllPosts = function () {
		return PostsFactory.data.loadedPosts = $http({
			method: "GET",
			url: "data/posts/all-posts.json"
		});
	};

	PostsFactory.getPost = function (id) {
		return PostsFactory.data.loadedPost = $http({
			method: "GET",
			url: "data/posts/" + id + ".json"
		});
	}

	return PostsFactory;
}

angular
	.module('app')
	.factory('PostsFactory', PostsFactory);