---
title: "Angular - Keeping data access layers agnostic"
layout: post
date: 2015-02-17 10:04:59 GMT
tags: angular, data
---

One of the challenges we've had to overcome, is how to have data access layers that are completely agnostic to the application, and therefore are portable.

As I said in the last post, one of the things that we've been trying to have are components that are decoupled entirely from any framework, this has also meant data access layers that have no knowledge of the framework either.

## Enter the SDK

For our data access layer, we have a fairly generic SDK that has been written in pure JavaScript, and accepts a series of values that enable us to have adapters written in whatever framework we're using at any given time. So, for example:

{% highlight javascript %}
#=> scripts/services/sdkadapter.js
define(function () {
  function SDKAdapter($http) {
    return new SDK({
      http: $http
    });
  }

  return SDKAdapter;
});
{% endhighlight %}

By doing this, our adapter can use a framework specific http client, but our SDK doesn't have to know anything about it. In this instance we're using the angular $http library, but it could just as easily be jQueries .ajax

## Tying this into controllers

When getting this into controllers, we quickly realised that our controllers were getting fairly large, and having to remember to inject the SDK and our handlers (I'll get onto those in a bit) into all of our directives was getting messy. So we came up with a simple and fairly elegant solution, to use a command bus.

### Command Buses are pretty sweet

What's a command bus? It's essentially a small piece of code that looks for a handler, makes a call and sends the data back to the controller via a callback. So, instead of having something like:

{% highlight javascript %}
#=> scripts/directives/userdirective.js
define(function () {
  function UserDirective() {
    return {
      controller: function ($scope, SDKAdapter) {
        $scope.data = {};

        SDKAdapter.GetUser({
          ID: 123456
        }).success(function (response) {
          [...]
        }).fail(function (err) {
          [...]
        });
      }
    };
  }

  return UserDirective;
});
{% endhighlight %}

Which adds a lot of unnecessary code into our controllers that we'd rather not have there. Instead we can have something like this:

{% highlight javascript %}
#=> scripts/directives/userdirective.js
define(function () {
  function UserDirective() {
    return {
      controller: function ($scope, CommandBus) {
        $scope.data = {};
        var command = {
          'name': 'GetUser',
          'parameters': {
            'ID': 123456
          }
        };

        CommandBus.run(command, function (response, err) {
         [...]
        });
      }
    };
  }

  return UserDirective;
});
{% endhighlight %}

#### What's in the command bus

What we wanted from the command bus was a very simple component that ferries requests from our controllers to the SDK and any handlers we need to run, so all it does is get a request, include the correct handler, and pass off any requests to it:

{% highlight javascript %}
#=> app/commandbus.js
define(function () {
  function CommandBus(SDKAdapter) {
    return {
      run: function (command, callback) {
        require(['handlers/' + command.name + 'Handler'], function (handler) {
          handler(command.parameters, SDKAdapter, callback);
        });
      }
    };
  }

  return CommandBus;
});
{% endhighlight %}

Then inside the command itself we'd simply have:

{% highlight javascript %}
#=> app/handlers/GetUserHandler.js
define(function () {
  return function (params, adapter, callback) {
    adapter.GetUser(params).success(function (response) {
      callback(response, null);
    }).fail(function (err) {
      callback(null, err);
    });
  }
});
{% endhighlight %}

That enables us to have controllers that are super simple, and only concerned with putting the data on the page, and not worrying about defining multiple functions based on if a call succeeds or fails.

It also means that our handlers, data fetching scripts etc don't know about the framework or adapters we're using, they'll just try to make the API call and respond with success or fail.
