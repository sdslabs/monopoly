  'use strict';

/* Controllers */
angular.module('mplyApp.controllers', [])
  .controller('startCtrl', function() {

  })
  .controller('lobbyCtrl', function() {

  })
  .controller('roomCtrl', function($scope)
  	{
  		$scope.creatorCheck = true;
  })
  .controller('gameCtrl',function()
  	{

  })
  .controller('leaderboardCtrl', function ($scope, $http)
  	{
      $http.post('/leaderboard').
        success(function(data) {
          console.log(data)
          // $scope.post = data.post;
        });
    });
