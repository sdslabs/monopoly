//Load Constants
var CONST = require('../constants.js');

//Load Properties
var properties = require('./properties.json');

//Load Paths
var paths = require('./paths.json');

function Location(){
	this.x = 0;
	this.y = 0;
	this.z = 0;
}

function Size(){
	this.width = 0;
	this.height = 0;
}

function Level(){
	var rent;
	var upgrade;
}

function Property(){

	this. id = null;

	this.name = null;
	this.owner = null;
	this.type = null;

	this.level = null;
	this.maxLevel = null;
	
	this.basePrice = 0;

	this.Size = new Size();
	this.Location = new Location();

}

function Map(){
	this.properties = properties;
	this.paths = paths;

	this.createdAt = null;
	this.type = 'monopoly';
}

module.exports.Map = Map;