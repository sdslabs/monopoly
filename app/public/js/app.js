'use strict';

/* App Module */

var mplyApp = angular.module('monopoly-app', ['ngRoute']);

mplyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/start',
        controller: 'startCtrl'
      }).
      when('/lobby', {
        templateUrl: 'partials/lobby',
        controller: 'lobbyCtrl'
      }).
      when('/room', {
        templateUrl: 'partials/room',
        controller: 'roomCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
