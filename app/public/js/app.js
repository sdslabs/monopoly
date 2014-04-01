'use strict';

/* App Module */

var mplyApp = angular.module('monopoly-app', [
  'ngRoute',
  'mplyApp.controllers'
  ]);

mplyApp.config(function ($routeProvider, $locationProvider) {
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
      when('/game', {
        templateUrl: 'partials/game',
        controller: 'gameCtrl'
      }).
      when('/leaderboard', {
        templateUrl: 'partials/leaderboard',
        controller: 'leaderboardCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  $locationProvider.html5Mode(true);
  });
