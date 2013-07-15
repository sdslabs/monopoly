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
        scaleY = 7

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
        console.log(propertyObjects);
    }

    var getProperty = function(key)
    {
        return propertyObjects[key];
    }

    return {
        initialise: initialise,
        getProperty: getProperty
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
//------------------------------------------------------------------------------------------


//Code for testing and debugging------------------------------------------------------------

    var img = new Image();
    img.src = "images/random.jpg";
    $(img).load(function()
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
                ctx.lineWidth = 0.1;
                ctx.strokeRect(property.route.x+ctx.lineWidth/2, property.route.y+ctx.lineWidth/2, property.route.w-ctx.lineWidth, property.route.h-ctx.lineWidth);
                ctx.restore();
            }

        monopoly.properties.initialise();
        monopoly.player.draw();
        $('body').mousedown(function(e)
        {
            console.log(e.pageX, e.pageY);
            console.log(properties);
        });
    })

//--------------------------------------------------------------------------------------------


});


