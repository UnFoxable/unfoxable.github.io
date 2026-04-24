var dcanvas = document.getElementById("displayimg");
var dctx = dcanvas.getContext('2d');

var rcanvas = new OffscreenCanvas(dcanvas.clientWidth*2, dcanvas.clientHeight*2);
var rctx = rcanvas.getContext('2d', {alpha: true, willReadFrequently: true});
console.log(rctx.getContextAttributes());

rctx.imageSmoothingEnabled = true;
var ogintsize = 3;
var intsize = ogintsize;
resize();

//about size variable
//size variable has 3 types: size, intsize, ogintsize
//ogintsize is used to calc the mousemovement to canvas/size ratio
//#stores the original value
//intsize is used to adjust other values based on canvas/size ratio
//#stores the size in integer format
//size is for adjusting the size of the canvas/screen ratio
//#stores the size in multiplication (0.25, 0.5, 1, 2, 4)

var nextline = [];
function draw() {
    color = document.querySelector('#pickcolour').value;
    inptwidth = document.querySelector('#inptwidth').value;

    rctx.lineWidth = inptwidth;
    rctx.lineCap = 'round';
    rctx.lineJoin = 'round';
    rctx.miterLimit = 1;
    rctx.strokeStyle = color;
    rctx.fillStyle = color;

    rctx.beginPath();

    //Chaikin's Algorithm
    var points = [[],[]]
    //points[0] == X
    //      [1] == Y
    
    mouseX = chaikinsh(points[0],mouseX)
    mouseY = chaikinsh(points[1],mouseY)

    if (smthtype == 0) {
        rctx.moveTo(nextline[0], nextline[1]);
        rctx.lineTo(points[0][1], points[1][1]);
        rctx.moveTo(points[0][1], points[1][1]);
        rctx.lineTo(points[0][0], points[1][0]);
    } else if (smthtype == 1) {
        rctx.moveTo(nextline[0], nextline[1]);
        rctx.quadraticCurveTo(points[0][1], points[1][1], points[0][0], points[1][0])
        rctx.moveTo(points[0][0], points[1][0]);
    }
    

    nextline[0] = points[0][0];
    nextline[1] = points[1][0];


    rctx.closePath()
    rctx.stroke()
    display()

    resizestore = rctx.getImageData(0, 0, rwidth, rheight);

    function chaikinsh(points, temp) {
        points[0] = (temp[0] * (3/4)) + (temp[1] * (1/4))
        points[1] = (temp[0] * (1/4)) + (temp[1] * (3/4))
        
        return temp;
    }
}

// copy from rcanvas to dcanvas
// var displaystore;
display();
var size = intsize;
function display() {
    // displaystore = rctx.getImageData(0, 0, rwidth, rheight);
    // dctx.putImageData(displaystore, 0, 0);
    // size = document.querySelector('#size').value;
    console.log(intsize)
    dctx.clearRect(0, 0, rwidth, rheight);
    dctx.drawImage(rcanvas, 0, 0, rwidth*size, rheight*size);
}
document.querySelector('#sizeL').addEventListener('click', (e) => {
    size = size*2
    intsize--;
    display();
})
document.querySelector('#sizeS').addEventListener('click', (e) => {
    size = size/2
    intsize++;
    display();
})

var smthtype = 0;
document.querySelector('#smthtype').addEventListener('input', (e) => {
    smthtype = document.querySelector('#smthtype').value
})

// stamp different shapes
function stamp(type, size) {
    switch(true) {
        case type == 'circle':
            circle(size);
            break;
        default:
            break;
    }
}
// stamp circle
function circle(size) {
    color = document.querySelector('#pickcolour').value;

    rctx.lineWidth = inptwidth;
    rctx.strokeStyle = color;
    rctx.fillStyle = color;

    rctx.beginPath()

    rctx.moveTo(mouseX[0], mouseY[0]);
    rctx.arc( mouseX[0], mouseY[0], size/100, 0, 2*Math.PI);
    rctx.fill()

    rctx.closePath();
    rctx.stroke();
    display();
}


// mouse tracking
var mouseX = [];
var mouseY = [];
var mouseState = 0;
window.addEventListener('mousemove', (e) => {

    // inptwidth = document.querySelector('#inptwidth').value;
    // stamp('circle', inptwidth);

    // mouseState = 1;
    //
    mouseX[0] = e.clientX*(size/size/size)*(intsize/(intsize*(1/ogintsize)));
    mouseY[0] = e.clientY*(size/size/size)*(intsize/(intsize*(1/ogintsize)));

    // for (var i=3;i>0;i--) {
    //     mouseX[i] = mouseX[i-1];
    //     mouseY[i] = mouseY[i-1];
    // }
    // console.log(mouseX);

    if(mouseState == 1) {
        draw();
    }

    mouseX[1] = mouseX[0];
    mouseY[1] = mouseY[0];
    
})
window.addEventListener('mousedown', (e) => {
    inptwidth = document.querySelector('#inptwidth').value;
    stamp('circle', inptwidth);

    nextline[0] = mouseX[0];
    nextline[1] = mouseY[0];

    mouseState = 1;
})
window.addEventListener('mouseup', (e) => {
    mouseState = 0;
})


// resize
var resizestore;
resizestore = rctx.getImageData(0, 0, rwidth, rheight);
window.addEventListener('resize', (e) => {
    // resizestore = rctx.getImageData(0, 0, rwidth, rheight);
    resize();
    rctx.putImageData(resizestore, 0, 0);
    display();
})

function resize() {
    rwidth = dcanvas.clientWidth*intsize;
    rheight = dcanvas.clientHeight*intsize;
    rcanvas.width = rwidth;
    rcanvas.height = rheight;
    dcanvas.width = rwidth;
    dcanvas.height = rheight;
}


// clear everything
function trash() {
    rctx.clearRect(0, 0, rwidth, rheight);
    display();
}

function drawoff() {
    //smh make it so tht mousestate is constantly 0, refer to mousedown
}
