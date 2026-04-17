const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

window.addEventListener('resize', runcanvas);
var mouse = {mouseX:null, mouseY: null};
var mouseRecord = {mouseX:null, mouseY: null};
var mouseDown = 0;

//on mouseDown set [mouseDown] to 1
window.addEventListener('mousedown', (e) => {
    mouseDown = 1;
    mouse = {mouseX: e.clientX, mouseY: e.clientY};
    drawcircle();
})

//on mouseUp set [mouseDown] to 0
window.addEventListener('mouseup', (e) => {mouseDown = 0;})

//on mousemove if mouse is down/pressed (mouseDown==1) it will continuously draw circle until mouse is up (mouseDown==0) 
window.addEventListener('mousemove', (e) => {
    if (mouseDown==1) {
        mouse = {mouseX: e.clientX, mouseY: e.clientY};
        drawcircle();
    } else {
        return;
    }
})

//if runcanvas(true) will refresh, if not will drawcircle;
function runcanvas(refresh) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (refresh==true) {
        return;
    } else {
        drawcircle;
    }
}
runcanvas();

//Draw circle top-half (if mouse is down (mouseDown==1))and if last recorded "stamp" is over [dist] pixels (eg. 20px) from current mouse position on either x or y axis
const dist = 20;
const size = 50;
function drawcircle() {
    if (parseInt(mouse.mouseX-mouseRecord.mouseX) >= dist || parseInt(mouse.mouseX-mouseRecord.mouseX) <= -(dist) || parseInt(mouse.mouseY-mouseRecord.mouseY) >= dist || parseInt(mouse.mouseY-mouseRecord.mouseY) <= -(dist)) {
        console.log(`MouseX: ${this.mouse.mouseX} \nMouseY: ${this.mouse.mouseY} \nMouseDown: ${mouseDown}`)
        console.log(`Xpos: ${parseInt(mouse.mouseX-mouseRecord.mouseX)}\nYpos:${parseInt(mouse.mouseY-mouseRecord.mouseY)}`);
        //setting drawing prerequisites
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'green';
        ctx.lineWidth = size/12;
        //begin drawing
        ctx.beginPath();
        ctx.arc(mouse.mouseX, mouse.mouseY, size, 1*Math.PI, 0*Math.PI);
        ctx.lineTo(mouse.mouseX-size-ctx.lineWidth/2, mouse.mouseY);
        ctx.fill();
        ctx.stroke();
        mouseRecord = {mouseX: mouse.mouseX, mouseY: mouse.mouseY};
    } else {
        return;
    }
}

function animation() {

}