---
title: "Angular - Decoupling for Fun and Profit"
layout: post
date: 2015-02-13 11:58:11 GMT
tags: angular, decoupling
---

Recently, whilst working on a neat new little project. That has come with, amongst other things, how to keep the application and the framework that drives that application separate.

With front-end frameworks iterating at such a rapid rate, we identified quickly that we'd need a product that was sufficiently decoupled from the framework we were using. In this post I'm going to go over some of the challenges we've faced in our attempts to keep our code decoupled, but also still make all the functionality we need to work, continue to work.

## Enter Require.js

If you've not heard of [require.js](http://requirejs.org/) I'd suggest you head over to their site and educate yourself. At its core, require is a tool for allowing a end dev to inject functionality into their applications, without that applications having to know about a specific framework or library we're using.

What this allows for is an application that can have all business logic that has no knowledge of the framework whatsoever, and therefore is portable, but also services that do have a knowledge of the framework and can use the services provided.

## Tying Angular and Require together

I've talked about require, and how it can separate the framework from your logic, but how do you actually go about that?

Well wonder no longer, below is an example of what we did in order to solve this particular problem.

{% highlight javascript %}
#=> app/config.js
require.config({
  paths: {
    // Tell require where to find the 'framework' when we require it
    'framework': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular.min.js'
  },
  shims: {
    // Tell angular what the export of that file will be, if it doesn't support require out of the box
    'framework': {exports: 'framework'}
  }
});
{% endhighlight %}

What's been done there is a very generic 'framework' has been included, that can be called from require and it will find the relevant file for us. Then for us to use that in our app, we create a main.js that require calls on init that will bootstrap everything for us.

{% highlight javascript %}
#=> app/main.js
require([
  'framework',
  'MyService',
  'MyFilter',
  'MyDirective',
  'MainCtrl'
], function (framework, MyService, MyFilter, MyDirective, MainCtrl) {
  var app = framework.module('app', []);

  // Register your controllers, services etc
  [...]

  framework.boostrap(document, ['app']);
});
{% endhighlight %}

Then we can have all of our angular specific functionality, simply require the items it needs, such as any dependencies on data layers etc inside each directive.

{% highlight javascript %}
#=> app/MyService.js
require('DataProvider', function (DataProvider) {
  function MyService () {
    // Run methods on the data provider, that has no knowledge of angular
  }

  return MyService;
});
{% endhighlight %}

## Cleaning up the app

We can however make this process much simpler, instead of having to include all dependencies and having to register them in the application, we can have a global config that has all the paths we need for our application.

For example we can define all our angular dependencies in an app specific file, like this:

{% highlight javascript %}
#=> app/paths.js
window.appPaths = {
  'directives': ['MyDirective'],
  'filters': ['MyFilter'],
  'services': ['MyService']
}};
{% endhighlight %}

We then have a bootstrapper that accepts that config, and loads our angular dependencies in for us, and registers them in the app

{% highlight javascript %}
#=> app/main.js
require([
  'bootstrapper'
], function (boostrapper) {
  bootstrapper.initApp();
});

#=> app/bootstrapper.js
define(
  window.appPaths.directives
    .concat([...])
, function () {
  var dependencies = arguments;

  function boot() {
    // Register your angular specific functionality in the app
  }

  var app = {
    initApp: function () {
      // Call the booter
      boot();
    }
  };

  return app;
});
{% endhighlight %}

## Testing

All this work makes the code you're writing very testable, as each component can be thought of as it's own, encapsulated piece of functionality. It doesn't necessarily require angular to run, and indeed, all the tests we have written for our specific case haven't included angular at all. Which means, if done right, this code can be moved anywhere, and used for any framework as long as the correct parameters are passed in.

Until next time.
