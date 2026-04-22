var rcanvas = document.getElementById("referenceimg");
var rctx = rcanvas.getContext('2d', {alpha: true, willReadFrequently: true});
console.log(rctx.getContextAttributes());
var dcanvas = document.getElementById("displayimg");
var dctx = dcanvas.getContext('2d');
rctx.imageSmoothingEnabled = true;
resize();


function draw() {
    color = document.querySelector('#pickcolour').value;

    inptwidth = document.querySelector('#inptwidth').value;
    if (!inptwidth) {
        inptwidth = 3;
    }

    rctx.lineWidth = inptwidth;
    rctx.lineCap = 'round';
    rctx.lineJoin = 'round';
    rctx.miterLimit = 1;
    rctx.strokeStyle = color;
    rctx.fillStyle = color;

    rctx.beginPath();

    cQ = (smooth+1)/4*2-1;
    cR = (smooth+1)/4*3-1;

    //Chaikin's Algorithm + BezierCurve (Smoothing Algorithm)
    mouseX[cQ] = (mouseX[0] * (3/4)) + (mouseX[smooth] * (1/4))
    mouseX[cR] = (mouseX[0] * (1/4)) + (mouseX[smooth] * (3/4))
    mouseY[cQ] = (mouseY[0] * (3/4)) + (mouseY[smooth] * (1/4))
    mouseY[cR] = (mouseY[0] * (1/4)) + (mouseY[smooth] * (3/4))

    rctx.moveTo(mouseX[0], mouseY[0]);
    rctx.bezierCurveTo(mouseX[cQ], mouseY[cQ], mouseX[cR], mouseY[cR], mouseX[smooth], mouseY[smooth]);

    // console.log(mouseX);
    // console.log(mouseY);

    rctx.closePath();

    rctx.stroke();
    display();
}

// copy from rcanvas to dcanvas
// var displaystore;
function display() {
    // displaystore = rctx.getImageData(0, 0, rwidth, rheight);
    // dctx.putImageData(displaystore, 0, 0);
    var size = document.querySelector('#size').value;
    console.log(size);
    dctx.clearRect(0, 0, rwidth, rheight);
    dctx.drawImage(rcanvas, rwidth, rheight, rwidth*size, rheight*size)
}

document.querySelector('#size').addEventListener('input', (e) => {
    display();
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
var smooth = 3*1;
var mouseX = [smooth];
var mouseY = [smooth];
var mouseState = 0;
window.addEventListener('mousemove', (e) => {
    mouseX[smooth] = mouseX[0];
    mouseY[smooth] = mouseY[0];

    mouseX[0] = e.clientX;
    mouseY[0] = e.clientY;

    // for (var i=3;i>0;i--) {
    //     mouseX[i] = mouseX[i-1];
    //     mouseY[i] = mouseY[i-1];
    // }
    // console.log(mouseX);

    if(mouseState == 1) {
        draw();
    }
})
window.addEventListener('mousedown', (e) => {
    inptwidth = document.querySelector('#inptwidth').value;
    if (!inptwidth) {
        inptwidth = 3;
    }
    stamp('circle', inptwidth);
    mouseState = 1;
})
window.addEventListener('mouseup', (e) => {
    mouseState = 0;
})

// resize
var resizestore;
window.addEventListener('resize', (e) => {
    resizestore = rctx.getImageData(0, 0, rwidth, rheight);
    resize();
    rctx.putImageData(resizestore, 0, 0);
    display();
})
function resize() {
    rwidth = rcanvas.clientWidth;
    rheight = rcanvas.clientHeight;
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