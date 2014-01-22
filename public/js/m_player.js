function Player(name, location, money)
{
	this.name = name ||""
	this.location = gMaps.lN(location) || {}
	this.money = money || 0
	this.propertyList = []
}
Player.prototype.draw = function()
{
	// gMaps.addMarkerAt({'latLng':this.location, 'cap':this.name})
}

Player.prototype.addProperty = function(property)
{
	this.propertyList.push(property)
}
Player.prototype.removeProperty = function(property)
{
	var index = this.propertyList.indexOf(property)
	if(index > -1)
		this.propertyList.splice(index, 1)
}
Player.prototype.getPropertyList = function()
{
	return this.propertyList
}

var players = (function()
{
	var all = {}
	var init = function()
	{
		var list = monopoly.getPlayerList()
		var startLocation = properties.getStartLocation()
		var initialAmount = monopoly.getGameConstants().INITIAL_AMOUNT
		for(var key in list)
		{
			var playerName = list[key].name
			all[playerName] = new Player(playerName, startLocation, initialAmount)
		}
		draw()
	}

	var draw = function()
	{
		for(var key in all)
		{
			var player = all[key]
			player.draw()
		}
	}

	var getPlayer = function(playerName)
	{
		return all[playerName]
	}
	return {
		init: init,
		all: all,
		getPlayer: getPlayer
	}
})()