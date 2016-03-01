//------------------------------------------------------------------------------
// Math
//------------------------------------------------------------------------------

// From https://gist.github.com/joates/6584908
function linspace(a,b,n) {
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
}

// Modified from http://stackoverflow.com/questions/8273047/javascript-function-similar-to-python-range
// answer by Tadeck
// Modification: adjust stop test in the for loop to be a little smaller/bigger
// so don't inadvertentlyget stop as the last value in the returned array
// (for example, try console.log(range(-1,1,0.1)) without the modification
// and will get 0.999999999999 as last value)
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }
    if (typeof step == 'undefined') {
        step = 1;
    }
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }
    var result = [];
    for (var i = start; step > 0 ? i < stop-0.01*step : i > stop+0.01*step; i += step) {
        result.push(i);
    }
    return result;
};

//------------------------------------------------------------------------------
// Other
//------------------------------------------------------------------------------

// For first use, call elapsed_time(0, "") to get your first time value which
// can be passed as t0 in subsequent elapsed time calls like this:
//     t2 = elapsed_time(t_previous, "message to print to console"
function elapsed_time(t0, text) {
    var t1 = performance.now();
    if (t0 != 0) console.log(text + " " + (t1 - t0) + " ms");
    return t1;
}

//------------------------------------------------------------------------------
// Object inspection
//------------------------------------------------------------------------------

function printObject(o) {
    console.log(o);
    var keys = Object.keys(o);
    for (var i=0; i<keys.length; i++) {
        console.log('  ', i, ', ', keys[i], ', ', o[keys[i]]);
    }
}

function listAllProperties(o){
	var objectToInspect;
	var result = [];

	for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)){
		result = result.concat(Object.getOwnPropertyNames(objectToInspect));
	}

	return result;
}

//------------------------------------------------------------------------------
// Canvas drawing
//------------------------------------------------------------------------------

function drawLinePath(ctx, cObj, dataObj) {
    // cObj is a Coordinates_with_margins or Coordinates object
    // dataObj = {x:[], data:[], isVisible:false, strokeStyle:"rgba(0,0,0,0.5)"}
    if (dataObj.x.length != dataObj.data.length) {
        console.log('**** ERROR: drawLinePath(); x and data arrays are not the same length ****');
        return;
    }
    ctx.save();
    ctx.beginPath();
    if (!("lineWidth" in dataObj)) ctx.lineWidth = 2;
    else ctx.lineWidth = dataObj.lineWidth;
    ctx.strokeStyle = dataObj.strokeStyle;
    ctx.moveTo(cObj.x_to_px(dataObj.x[0]),cObj.y_to_px(dataObj.data[0]));
    for (var i=1;i<=dataObj.data.length;i++) {
        ctx.lineTo(cObj.x_to_px(dataObj.x[i]),cObj.y_to_px(dataObj.data[i]));
    }
    ctx.stroke();
    ctx.restore();
}

function draw_circle(ctx, x, y, radius, color) {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawArrow(ctx, fromx, fromy, tox, toy, linewidth, headlength, color){
    // Adapted from http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
	//variables to be used when creating the arrow
	var headlen = headlength;

	var angle = Math.atan2(toy-fromy,tox-fromx);
    ctx.save();

	//starting path of the arrow from the start square to the end square and drawing the stroke
	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(tox, toy);
	ctx.strokeStyle = color;
	ctx.lineWidth = linewidth;
	ctx.stroke();

	//starting a new path from the head of the arrow to one of the sides of the point
	ctx.beginPath();
	ctx.moveTo(tox, toy);
	ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

	//path from the side point of the arrow, to the other side point
	ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

	//path from the side point back to the tip of the arrow, and then again to the opposite side point
	ctx.lineTo(tox, toy);
	ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

	//draws the paths created above
	ctx.strokeStyle = color;
	ctx.lineWidth = linewidth;
	ctx.stroke();
	ctx.fillStyle = color;
	ctx.fill();
    ctx.restore();
}
