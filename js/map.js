$(document).ready(function()
{

    $('#canvas').attr('width', window.innerWidth);
    $('#canvas').attr('height', window.innerHeight);

    (function()
    {
        canvas = $("#canvas"),
        ctx = canvas.get(0).getContext('2d'),
        cWidth = canvas.width(),
        cHeight = canvas.height()
        clearStyle = "black"

    })()
var monopoly = {};

monopoly.properties = (function()
{
    var properties = [];

})()


function Property(propertyObject)
{
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   this.name = propertyObject.name;
   
}



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
                ctx.scale(8, 7);
                ctx.drawImage(img, property.x, property.y, property.w, property.h);

                ctx.fillStyle = "white";
                ctx.fillRect(property.route.x, property.route.y, property.route.w, property.route.h);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 0.1;
                ctx.strokeRect(property.route.x+ctx.lineWidth/2, property.route.y+ctx.lineWidth/2, property.route.w-ctx.lineWidth, property.route.h-ctx.lineWidth);
                ctx.restore();
            }

        $('body').mousedown(function(e)
        {
            console.log(e.pageX, e.pageY);
            console.log(properties);
        });

    })

});


