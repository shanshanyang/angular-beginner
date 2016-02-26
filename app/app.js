'use strict';

// Declare app level module which depends on filters, and services
angular.module('DashBoard', [
    'DashBoard.config',
    'DashBoard.security',
    'DashBoard.home',
    'DashBoard.account',
    'DashBoard.chat',
    'DashBoard.login'
  ])
  
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  }])
  
  .run(['$rootScope', 'Auth', function($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);