angular.module('app', [
  'ionic',
  'firebase',
  'angular-lodash',
  'app.config',
  'app.controllers',
  'app.services',
  'app.directives'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|geo):/);
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/app.html",
    controller: function($scope, $rootScope, Auth, Friends){
      Auth.anonymous().then(function(user){
        $rootScope.user = user;
      })
      $scope.android = ionic.Platform.platform() == 'android';
      $scope.Friends = Friends;
    }
  })

  // Each tab has its own nav history stack:

  .state('app.bars', {
      url: '/bars',
      views: {
        'menuContent': {
          templateUrl: 'templates/bars/list.html',
          controller: 'BarListCtrl'
        }
      }
    })
    .state('app.bar-show', {
      url: '/bars/:barId',
      resolve: {
        bar: function($stateParams, Bars){
          return Bars.get($stateParams.barId);
        }
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/bars/show.html',
          controller: 'BarShowCtrl'
        }
      }
    })

  .state('app.friends', {
      url: '/friends',
      views: {
        'menuContent': {
          templateUrl: 'templates/friends/list.html',
          controller: 'FriendListCtrl'
        }
      }
    })
    .state('app.friend-show', {
      url: '/friends/:friendId',
      views: {
        'menuContent': {
          templateUrl: 'templates/friends/show.html',
          controller: 'FriendShowCtrl'
        }
      }
    })

  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/bars');

});
