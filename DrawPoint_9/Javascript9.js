var rcanvas = document.getElementById("referenceimg");
var rctx = rcanvas.getContext('2d', {alpha: true, willReadFrequently: true});
console.log(rctx.getContextAttributes());
var dcanvas = document.getElementById("displayimg");
var dctx = dcanvas.getContext('2d');
rctx.imageSmoothingEnabled = true;
resize();

function draw() {
    color = document.querySelector('#pickcolour').value;

    rctx.lineWidth = 5;
    rctx.strokeStyle = color;
    rctx.fillStyle = color;

    rctx.lineTo(mouseX, mouseY);
    rctx.stroke();
    rctx.closePath();
    display();
    rctx.beginPath();
    rctx.moveTo(mouseX, mouseY);
}

// copy from rcanvas to dcanvas
var displaystore;
function display() {
    displaystore = rctx.getImageData(0, 0, rcanvas.clientWidth, rcanvas.clientHeight);
    dctx.putImageData(displaystore, 0, 0);
}

// mouse tracking
var mouseX, mouseY, mouseState = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(mouseState == 1) {
        draw();
    }
})
window.addEventListener('mousedown', (e) => {
    rctx.moveTo(mouseX, mouseY);
    mouseState = 1;
})
window.addEventListener('mouseup', (e) => {
    mouseState = 0;
    rctx.moveTo(mouseX, mouseY);
    rctx.stroke();
    rctx.closePath();
})

// resize
var resizestore;
window.addEventListener('resize', (e) => {
    resizestore = rctx.getImageData(0, 0, cwidth, cheight);
    resize();
    rctx.putImageData(resizestore, 0, 0);
    display();
})
function resize() {
    cwidth = rcanvas.clientWidth;
    cheight = rcanvas.clientHeight;
    rcanvas.width = cwidth;
    rcanvas.height = cheight;
    dcanvas.width = cwidth;
    dcanvas.height = cheight;
}

// clear everything
function trash() {
    rctx.clearRect(0, 0, cwidth, cheight);
    display();
}