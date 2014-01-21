var angularjs = (function()
{
	var monopolyApp = angular.module('monopoly-app', ['ngRoute']);
	monopolyApp.controller('game-list-controller', function($scope)
	{
		$scope.gameList = []
	});
	monopolyApp.controller('player-list-controller', function($scope)
	{
		$scope.playerList = []
		$scope.creatorCheck = false
	});

	return {
		init: function()
		{

		},

		updateGameList: function(list)
		{
			var scope = angular.element($('#lobby-screen')).scope()
			scope.$apply(function()
			{
				scope.gameList = []
				scope.gameList = JSON.parse(list)
			})
		},

		updatePlayerList: function(list)
		{
			var scope = angular.element($('#room-screen')).scope()
			scope.$apply(function()
			{
				scope.playerList = []
				scope.playerList = JSON.parse(list)
			})

		},

		initCreatorControls: function(creatorCheck)
		{
			var scope = angular.element($('#room-screen')).scope()
			scope.$apply(function()
			{
				scope.creatorCheck = creatorCheck
			})
		},

		monopolyApp: monopolyApp
	}
})();