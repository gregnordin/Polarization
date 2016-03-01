//------------------------------------------------------------------------------
// Main class definitions
//------------------------------------------------------------------------------

// Class - map plot coordinates to canvas pixel coordinates and vice versa
function Coordinates(canvas, xmin, xmax, ymin, ymax) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "15px Arial";
    this.xmin_canvas = xmin;
    this.xmax_canvas = xmax;
    this.xrange = xmax-xmin;
    this.ymin_canvas = ymin;
    this.ymax_canvas = ymax;
    this.yrange = ymax-ymin;
    this.xscale = canvas.width / this.xrange;  // # canvas pixels per unit in x
    this.yscale = canvas.height / this.yrange;  // # canvas pixels per unit in y
    this.x0_px = -this.xmin_canvas*this.xscale; // x0 pixels from left to x=0
    this.y0_px = canvas.height + this.ymin_canvas*this.yscale; // y0 pixels from top to x=0
    this.x_to_px = function(x) {return x*this.xscale + this.x0_px;}
    this.y_to_px = function(y) {return -y*this.yscale + this.y0_px;}
    this.px_to_x = function(x_px) {return (x_px-this.x0_px)/this.xscale;}
    this.px_to_y = function(y_px) {return (-y_px+this.y0_px)/this.yscale;}
    this.setCanvasBackgroundColor = function(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    this.clearCanvas = function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

// Set up Coordinates with margins. xmin, xmax, ymin, ymax will be the min/max
// values for plot coordinates within the margins. Margins are defined as fractions
// of the canvas width/height (for example, left=0.1 means a left margin that is
// 10% of canvas.width).
// For how to do javascript class inheritance see
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// and go to section "Inheritance"
function Coordinates_with_margins(canvas, xmin, xmax, ymin, ymax, left, right, top, bottom) {
    var a = (xmax-xmin)/((1-left-right)*canvas.width);
    var b = (ymax-ymin)/((1-top-bottom)*canvas.height);
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    Coordinates.call(this, canvas,
                     xmin - a*left*canvas.width,
                     xmax + a*right*canvas.width,
                     ymin - b*bottom*canvas.height,
                     ymax + b*top*canvas.height);
    this.setNonMarginBackgroundColor = function(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.x_to_px(this.xmin),
                          this.y_to_px(this.ymax),
                          this.xscale*(this.xmax-this.xmin),
                          this.yscale*(this.ymax-this.ymin));
    }
    this.drawAxisLines = function() {
        drawArrow(this.ctx, this.x_to_px(this.xmin), this.y_to_px(0),
                  this.x_to_px(this.xmax)+10, this.y_to_px(0),
                  1, 8, "black");
        drawArrow(this.ctx, this.x_to_px(0), this.y_to_px(this.ymin),
                  this.x_to_px(0), this.y_to_px(this.ymax)-10,
                  1, 8, "black");
        // this.ctx.moveTo(this.x_to_px(this.xmin),this.y_to_px(0));
        // this.ctx.lineTo(this.x_to_px(this.xmax),this.y_to_px(0));
        // this.ctx.moveTo(this.x_to_px(0),this.y_to_px(this.ymin));
        // this.ctx.lineTo(this.x_to_px(0),this.y_to_px(this.ymax));
        // this.ctx.stroke();
    }
    this.drawAxes = function(xLabel, yLabel) {
        this.drawAxisLines();
        this.ctx.save();
        this.ctx.fillStyle = "#000000";
        this.ctx.textAlign = "left";
        this.ctx.fillText(xLabel, this.x_to_px(this.xmax)+15,
                          this.y_to_px(0));
        this.ctx.textAlign = "center";
        this.ctx.fillText(yLabel, this.x_to_px(0),
                          this.y_to_px(this.ymax)-22);
        this.ctx.restore();
    }

}
Coordinates_with_margins.prototype = Object.create(Coordinates.prototype);
Coordinates_with_margins.prototype.constructor = Coordinates_with_margins;
