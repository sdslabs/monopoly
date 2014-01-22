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
	monopolyApp.controller('player-details-controller', function($scope)
	{
		$scope.playerDetails = {}
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

		updatePlayerDetails: function(money, propertyList)
		{
			var scope = angular.element($('#player-details')).scope()
			scope.$apply(function()
			{
				if(money != -1)
					scope.playerDetails.money = money
				if(!$.isEmptyObject(propertyList))
					scope.playerDetails.propertyList = propertyList
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