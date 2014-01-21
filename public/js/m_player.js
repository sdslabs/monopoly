function Player(name, location)
{
	this.name = name ||""
	this.location = gMaps.lN(location) || {}
}
Player.prototype.draw = function()
{
	gMaps.addMarkerAt({'latLng':this.location, 'cap':this.name})
}

var players = (function()
{
	var all = []
	var init = function()
	{
		var list = monopoly.getPlayerList()
		var startLocation = map.getStartLocation()
		for(var key in list)
		{
			all.push(new Player(list[key].name, startLocation))
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
	return {
		init: init,
		all: all
	}
})()