$(document).ready(function()
{

//JS Constructors------------------------------------------------------------
    function Property(propertyObject)
    {
        for(var key in propertyObject)   
        {
            var value = propertyObject[key];
            this[key] = value;
        }
        this.owner = "Not owned";
        this.upgradeLevel = 0;
        this.maxLevel = false;
    }

    Property.prototype.displayPopup = function(x, y)
    {
        var propertyOwner = ($("#propertyOwner").text()).substr(0,10) + this.owner;
        var propertyCost = ($("#propertyCost").text()).substr(0,6) + this.cost.toString();
        var propertyLevel = ($("#propertyLevel").text()).substr(0,15) + this.upgradeLevel;

        $("#propertyName").text(this.name);
        $("#propertyOwner").text(propertyOwner);
        $("#propertyCost").text(propertyCost);
        $("#propertyLevel").text(propertyLevel);

        $("#popup").css({
            left: x + "px",
            top: y + "px",
            display: "block"
        });
    }
//-------------------------------------------------------------------------

//Setting canvas dimensions to window dimensions and declaring canvas globals------------
    $('#canvas').attr('width', window.innerWidth);
    $('#canvas').attr('height', window.innerHeight);

    (function()
    {
        canvas = $("#canvas"),
        ctx = canvas.get(0).getContext('2d'),
        cWidth = canvas.width(),
        cHeight = canvas.height()
        clearStyle = "black",
        scaleX = 8,
        scaleY = 7,
        blockLineWidth = 0.1

    })()
//----------------------------------------------------------------------------------------

//Monopoly modules------------------------------------------------------------------------

var monopoly = {};

monopoly.properties = (function()
{
    var propertyObjects = {};

    var initialise = function()
    {
        for(var key in properties)
        {
            var property = properties[key];
            propertyObjects[key] = new Property(property);
        }
    }

    var getProperty = function(key)
    {
        return propertyObjects[key];
    }

    var getPropertyContaining = function(x, y) //Returns property containing point (x,y)
    {
        x = x/scaleX, y = y/scaleY;

        for(var key in propertyObjects)
        {
            var property = propertyObjects[key];
            if(property.x < x && property.y < y && property.x + property.w > x && property.y + property.h > y)
                return property;
        }

        return false;
    }

    var displayPopup = function(property, x, y)
    {
        property.displayPopup(x, y);
    }

    var hidePopup = function(property)
    {
        $("#popup").css({display:"none"});
    }

    var highlightProperty = function(property)
    {
        ctx.save();
        ctx.fillStyle = "red";
        ctx.scale(scaleX, scaleY);
        ctx.fillRect(property.route.x + blockLineWidth/2, property.route.y + blockLineWidth/2, property.route.w - blockLineWidth, property.route.h - blockLineWidth);
        ctx.restore();
    }

    return {
        initialise: initialise,
        getProperty: getProperty,
        getPropertyContaining: getPropertyContaining,
        displayPopup: displayPopup,
        hidePopup: hidePopup,
        highlightProperty: highlightProperty,
    }
})();

monopoly.player = (function()
{
    var currPropertyKey = "alpahar";

    var draw = function()
    {
        var currProperty = monopoly.properties.getProperty(currPropertyKey);
        var cX = currProperty.route.x + currProperty.route.w/2, cY = currProperty.route.y + currProperty.route.h/2;

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.scale(scaleX, scaleY);
        ctx.arc(cX, cY, 0.7, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.restore();
    }

    return {
        draw: draw
    }
})();

monopoly.input = (function()
{
    var currProperty = {}, lastProperty ={};

    var initialise = function()
    {
        $('body').bind('mousemove', mousemove);
    }

    var mousemove = function(e)
    {
        lastProperty = currProperty;
        if(currProperty = monopoly.properties.getPropertyContaining(e.pageX, e.pageY))
        {
            monopoly.properties.displayPopup(currProperty, e.pageX, e.pageY);
            monopoly.properties.highlightProperty(currProperty);

            if(currProperty.name != lastProperty.name && lastProperty.name != undefined) //Checks for property-to-property transitions
                main();
        }    

        else if(!$.isEmptyObject(lastProperty)) //Checks for property-to-empty-space transitions
        {
            monopoly.properties.hidePopup(); 
            main();
        }        
    }

    return {
        initialise: initialise,
    }
})();
//------------------------------------------------------------------------------------------


//Code for testing and debugging------------------------------------------------------------

    var img = new Image();
    img.src = "images/random.jpg";
    main = function()
    {

        var clearScreen = function()
        {
            ctx.save();
            ctx.fillStyle = clearStyle;
            ctx.fillRect(0,0,cWidth, cHeight);

            for(var i = 0, j = 0; i < cWidth; i += cWidth/10, j += cHeight/10)
            {
                ctx.beginPath();    
                ctx.setLineDash([1,2]);
                ctx.moveTo(i,0);
                ctx.lineTo(i,cHeight);
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();    
                ctx.setLineDash([1,2]);
                ctx.moveTo(0,j);
                ctx.lineTo(cWidth,j);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
        }

        clearScreen();
        ctx.save();
        ctx.restore();
            for(var key in properties)
            {
                var property = properties[key];
                // console.log(property);

                ctx.save();
                ctx.scale(scaleX, scaleY);
                ctx.drawImage(img, property.x, property.y, property.w, property.h);

                ctx.fillStyle = "white";
                ctx.fillRect(property.route.x, property.route.y, property.route.w, property.route.h);
                ctx.strokeStyle = "black";
                ctx.lineWidth = blockLineWidth;
                ctx.strokeRect(property.route.x+ctx.lineWidth/2, property.route.y+ctx.lineWidth/2, property.route.w-ctx.lineWidth, property.route.h-ctx.lineWidth);
                ctx.restore();
            }

        monopoly.properties.initialise();
        monopoly.input.initialise();
        monopoly.player.draw();

        $('body').mousemove(function(e)
        {
            // console.log(e.pageX, e.pageY);
        });
    }


    $(img).load(main);

//--------------------------------------------------------------------------------------------


});


