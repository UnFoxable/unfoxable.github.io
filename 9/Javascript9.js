var dcanvas = document.getElementById("displayimg");
var dctx = dcanvas.getContext('2d');

var rcanvas = new OffscreenCanvas(1,1); // rcanvas width/height is adjusted in resize()
var rctx = rcanvas.getContext('2d', {alpha: true, willReadFrequently: true});
console.log(rctx.getContextAttributes());

rctx.imageSmoothingEnabled = true;

const rwidth = 1000;
const rheight = 1000;
var ogsize = 1;
resize();

//about size variable
//size variable has 2 types: size, ogsize
//ogsize is used to calc the mousemovement to canvas/size ratio
//#stores the original value
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

    if (smthtype == 0 || smthtype == 1) {
            var points = [[],[]]
            //points[0] == X
            //      [1] == Y

            mouseX = chaikinsh(points[0],mouseX)
            mouseY = chaikinsh(points[1],mouseY)

        if (smthtype == 0) {
            //Chaikin's Algoritm
            rctx.moveTo(nextline[0], nextline[1]);
            rctx.lineTo(points[0][1], points[1][1]);
            rctx.moveTo(points[0][1], points[1][1]);
            rctx.lineTo(points[0][0], points[1][0]);

        } else if (smthtype == 1) {
            //quadratic Curve (bezier Curve)
            rctx.moveTo(nextline[0], nextline[1]);
            rctx.quadraticCurveTo(points[0][1], points[1][1], points[0][0], points[1][0])
            rctx.moveTo(points[0][0], points[1][0]);

        }
            nextline[0] = points[0][0];
            nextline[1] = points[1][0];

    } else if (smthtype = 2) {
        //normal lines
        rctx.moveTo(nextline[0], nextline[1]);

        rctx.lineTo(mouseX[1], mouseY[1]);
        rctx.moveTo(mouseX[1], mouseY[1]);
        rctx.lineTo(mouseX[0], mouseY[0]);

        nextline[0] = mouseX[0];
        nextline[1] = mouseY[0];
    }


    rctx.closePath()
    rctx.stroke()
    display()

    resizestore = rctx.getImageData(0, 0, dwidth, dheight);

    function chaikinsh(points, temp) {
        points[0] = (temp[0] * (3/4)) + (temp[1] * (1/4))
        points[1] = (temp[0] * (1/4)) + (temp[1] * (3/4))
        
        return temp;
    }
}

window.addEventListener('keydown', function (e) {

    // increase the size of the actual canvas
    if (e.key == 'ArrowDown') {
        ogsize++
    } else if (e.key == 'ArrowUp') {
        if (ogsize == 1) {
            return;
        }
        ogsize--
    }
    
    resize()
    // rctx.putImageData(resizestore, 0, 0);
    display()
})


// copy from rcanvas to dcanvas
var size = ogsize;
var coords = [];
coords[0] = 0;
coords[1] = 0;
display();
function display() {
    dctx.clearRect(0, 0, rwidth, rheight);
    dctx.setTransform(size,0,0,size,0,0);
    dctx.translate(coords[0],coords[1]);
    dctx.drawImage(rcanvas, 0, 0);
}

// change size (setTransform)
var changesizeby = 2
document.querySelector('#sizeL').addEventListener('click', (e) => {
    size = size*changesizeby
    display();
})
document.querySelector('#sizeS').addEventListener('click', (e) => {
    size = size/changesizeby
    display();
})

// change movement (translate)
var speed = 100
document.querySelector('#moveL').addEventListener('click', (e) => {
    coords[0] -= speed
    display()
})
document.querySelector('#moveR').addEventListener('click', (e) => {
    coords[0] += speed
    display()
})
document.querySelector('#moveU').addEventListener('click', (e) => {
    coords[1] += speed
    display()
})
document.querySelector('#moveD').addEventListener('click', (e) => {
    coords[1] -= speed
    display()
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
    mouseX[0] = ((e.clientX*(size/size/size)*ogsize)-coords[0])
    mouseY[0] = ((e.clientY*(size/size/size)*ogsize)-coords[1])
    // console.log("A::" + (e.clientX))
    // console.log("B::" + mouseX[0])


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
resizestore = rctx.getImageData(0, 0, dwidth, dheight);
window.addEventListener('resize', (e) => {
    // resizestore = rctx.getImageData(0, 0, dwidth, dheight);
    resize();
    // rctx.putImageData(resizestore, 0, 0);
    display();
})

rcanvas.width = rwidth;
rcanvas.height = rheight;
function resize(putdata) {
    dwidth = dcanvas.clientWidth*ogsize;
    dheight = dcanvas.clientHeight*ogsize;
    dcanvas.width = dwidth;
    dcanvas.height = dheight;
}


// clear everything
function trash() {
    rctx.clearRect(0, 0, dwidth, dheight);
    display();
}

function drawoff() {
    //smh make it so tht mousestate is constantly 0, refer to mousedown
}