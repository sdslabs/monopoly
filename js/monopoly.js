$(document).ready(function()
{

//JS Constructors------------------------------------------------------------
    function Property(propertyObject, id)
    {
        for(var key in propertyObject)   
        {
            var value = propertyObject[key];
            this[key] = value;
        }
        this.owner = "Not owned";
        this.upgradeLevel = 0;
        this.maxLevel = false;
        this.id = id;
    }

    Property.prototype.displayPopup = function(x, y)
    {
        var propertyOwner = "Owned by: " + this.owner;
        var propertyCost = "Cost: " + this.cost.toString();
        var propertyLevel = "Upgrade Level: " + this.upgradeLevel;

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
            propertyObjects[key] = new Property(property, key);
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

    var getNextProperty = function(property)
    {
          return getProperty(property.next);
    }

    return {
        initialise: initialise,
        getProperty: getProperty,
        getPropertyContaining: getPropertyContaining,
        displayPopup: displayPopup,
        hidePopup: hidePopup,
        highlightProperty: highlightProperty,
        getNextProperty: getNextProperty
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

    var moveBy = function(number)
    {
        var nextProperty = {}, currProperty = monopoly.properties.getProperty(currPropertyKey);
        for(var i = 1; i <= number; i++)
        {
            nextProperty = monopoly.properties.getNextProperty(currProperty);
            currProperty = nextProperty;
        }
        currPropertyKey = nextProperty.id;
    }

    return {
        draw: draw,
        moveBy: moveBy
    }
})();

monopoly.input = (function()
{
    var currProperty = {}, lastProperty ={};

    var initialise = function()
    {
        $('body').bind('mousemove', mousemove);
        $('#play').bind('mousedown', onPlayClick)
        $('body').bind('mousedown', onCanvasClick)
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

    var onCanvasClick = function(e)
    {
        console.log(monopoly.properties.getPropertyContaining(e.pageX, e.pageY));
    }
    var onPlayClick = function(e)
    {
        $('#play').unbind(); //So that further clicks on Play button cannot be made until current action is complete

        var frameCount = 0, finalNumber = 0, animWait = false;
        var animFunction = function()
        {

                finalNumber = Math.ceil(Math.random()*6);
                $("#randomNumber").text(finalNumber);
                frameCount++;
                if(frameCount == 20)
                {
                    animWait = true;
                    monopoly.player.moveBy(finalNumber);
                    $('#play').bind('mousedown', onPlayClick)
                    main();
                    clearTimeout(animInt);
                }
                else
                    setTimeout(animFunction, 100);
        };

        var animInt = setTimeout(animFunction, 0);


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


        monopoly.player.draw();

        $('body').mousemove(function(e)
        {
            // console.log(e.pageX, e.pageY);
        });
    }

    monopoly.properties.initialise();
    monopoly.input.initialise();
    $(img).load(main);

//--------------------------------------------------------------------------------------------


});


