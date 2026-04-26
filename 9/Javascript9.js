var dcanvas = document.getElementById("displayimg");
var dctx = dcanvas.getContext('2d');

var rcanvas = new OffscreenCanvas(1,1); // rcanvas width/height is adjusted in resize()
var rctx = rcanvas.getContext('2d', {alpha: true, willReadFrequently: true});
console.log(rctx.getContextAttributes());

rctx.imageSmoothingEnabled = true;

const rwidth = 2000;
const rheight = 2000;
var ogsize = 1;
resize();

//about size variable
//size variable has 2 types: size, ogsize
//ogsize is used to calc the mousemovement to canvas/size ratio
//#stores the original value
//size is for adjusting the size of the canvas/screen ratio
//#stores the size in multiplication (0.25, 0.5, 1, 2, 4)


//nextline is the previously recorded line
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

    if (smthtype <= 1) {
        //Chaikin's Algoritm
        var points = [[],[]]
        //points[0] == X
        //      [1] == Y
        mouseX = chaikinsh(points[0],mouseX)
        mouseY = chaikinsh(points[1],mouseY)

        if (smthtype == 0) {
            //Chaikin's Algorithm Pure
            rctx.moveTo(nextline[0], nextline[1]);
            rctx.lineTo(points[0][1], points[1][1]);
            rctx.moveTo(points[0][1], points[1][1]);
            rctx.lineTo(points[0][0], points[1][0]);

        } else if (smthtype == 1) {
            //C.Algo + quadratic Curve (bezier Curve)
            rctx.moveTo(nextline[0], nextline[1]);
            rctx.quadraticCurveTo(points[0][1], points[1][1], points[0][0], points[1][0])
            rctx.moveTo(points[0][0], points[1][0]);

        }
            nextline[0] = points[0][0];
            nextline[1] = points[1][0];

    } else if (smthtype >= 2) {
        if (smthtype == 2) {
            //normal lines
            rctx.moveTo(nextline[0], nextline[1]);

            rctx.lineTo(mouseX[1], mouseY[1]);
            rctx.moveTo(mouseX[1], mouseY[1]);
            rctx.lineTo(mouseX[0], mouseY[0]);

            nextline[0] = mouseX[0];
            nextline[1] = mouseY[0];
        } else if (smthtype == 3) {
            //normal quadratic curve
            rctx.moveTo(nextline[0], nextline[1]);
            rctx.quadraticCurveTo(mouseX[1], mouseY[1], mouseX[0], mouseY[0])
            rctx.moveTo(mouseX[0], mouseY[0]);
            nextline[0] = mouseX[0];
            nextline[1] = mouseY[0];
        }
    }


    rctx.closePath()
    rctx.stroke()

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
    
    display()
})


// copy from rcanvas to dcanvas
var size = ogsize;
var coords = [];
coords[0] = rwidth/2*-1;
coords[1] = rheight/2*-1;
display();
function display() {
    resize()
    dctx.fillStyle = 'black'
    var linetemp = (rwidth/300 + rheight/300)
    dctx.lineWidth = linetemp

    dctx.setTransform(size,0,0,size,dwidth/2,dheight/2)
    dctx.translate(coords[0], coords[1])
    dctx.strokeRect(linetemp/2*-1, linetemp/2*-1, rwidth+linetemp, rheight+linetemp)
    dctx.drawImage(rcanvas, 0, 0)
}


// change size (setTransform)
var changesizeby = 2
document.querySelector('#sizeL').addEventListener('click', (e) => {
    size = size*changesizeby
    display()
})
document.querySelector('#sizeS').addEventListener('click', (e) => {
    size = size/changesizeby
    display()
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
window.addEventListener("wheel", (e) => {
    passive: true;
    // e.preventDefault()

    coords[0] -= e.deltaX/(size*1.5)
    coords[1] -= e.deltaY/(size*1.5)
    display()
});


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
var mouseStateLock = 0;
window.addEventListener('mousemove', (e) => {
    // uncomment and change mousemove to mousedown for testing (also comment out mousedown)
    // inptwidth = document.querySelector('#inptwidth').value;
    // stamp('circle', inptwidth);

    // mouseState = 1;
    //
    mouseX[0] = ((e.clientX*(1/size)*ogsize)-coords[0])-((dwidth/2)/size)
    mouseY[0] = ((e.clientY*(1/size)*ogsize)-coords[1])-((dheight/2)/size)

    if(mouseState == 1 && mouseStateLock == 0) {
        draw();
        display();
    }

    mouseX[1] = mouseX[0];
    mouseY[1] = mouseY[0];
    
})
window.addEventListener('mousedown', (e) => {
    mouseRefresh()

    if(mouseStateLock == 0) {
        inptwidth = document.querySelector('#inptwidth').value;
        stamp('circle', inptwidth);
        mouseState = 1
    }
})

// undoredo stuff
var undoredo = [];
var udrdtrack = 0;
undoredo[0] = rctx.getImageData(0, 0, rwidth, rheight);
var udrdcap = 0;
window.addEventListener('mouseup', (e) => {
    mouseRefresh()

    if(mouseStateLock == 0) {
        mouseState = 0
        udrdrecord()
        setDataURL()
    }
})

function mouseRefresh() {
    mouseX[0] = ((event.clientX*(1/size)*ogsize)-coords[0])-((dwidth/2)/size)
    mouseY[0] = ((event.clientY*(1/size)*ogsize)-coords[1])-((dheight/2)/size)
    mouseX[1] = mouseX[0];
    mouseY[1] = mouseY[0];
    nextline[0] = mouseX[0];
    nextline[1] = mouseY[0];
}

function udrdrecord() {
    // record undoredo
    udrdtrack++
    undoredo[udrdtrack] = rctx.getImageData(0, 0, rwidth, rheight);
    udrdcap = udrdtrack
}

document.querySelector('#undoR').addEventListener('click', (e) => {
    if (udrdtrack <= 0) { flash('#undoR'); return; }
    udrdtrack--
    rctx.putImageData(undoredo[udrdtrack], 0, 0)
    display()
})
document.querySelector('#redoU').addEventListener('click', (e) => {
    if (udrdtrack >= udrdcap) { flash('#redoU'); return; }
    udrdtrack++
    rctx.putImageData(undoredo[udrdtrack], 0, 0)
    display()
})
function flash(el) {
    el = document.querySelector(el)
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'undoredo 0.5s 1 paused';
    el.style.animationPlayState = 'running';
}

// resize
window.addEventListener('resize', (e) => {
    display();
})
rcanvas.width = rwidth;
rcanvas.height = rheight;
function resize() {
    dwidth = dcanvas.clientWidth*ogsize;
    dheight = dcanvas.clientHeight*ogsize;
    dcanvas.width = dwidth;
    dcanvas.height = dheight;
}

// create blob and convert to dataURL
function setDataURL() {
    rcanvas.convertToBlob().then((blob) => {
        dataURL = URL.createObjectURL(blob)
        document.querySelector('#dwld').setAttribute('href', dataURL)
        document.querySelector('#dwld2').setAttribute('href', dataURL)
        // document.querySelector('#dwld2').setAttribute('download', dataURL)
    });
}

var fileurl = 0;
document.querySelector('#import').addEventListener('click', (e) => {
    if(fileurl == 0) {
        importfile = document.querySelector('#importfile').files[0]
        image = new Image()
        const reader = new FileReader()
        reader.readAsDataURL(importfile)
        reader.addEventListener('loadend', (e) => {
            image.src = reader.result
            rctx.drawImage(image, 0, 0)
            display()
        })
    } else if (fileurl == 1) {
        importurl = document.querySelector('#importurl').value
        image = new Image()
        request = new Request(importurl)

        window.fetch(request).then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob();
        })
        .then((response) => {
            image.src = URL.createObjectURL(response);
        });

        // image.src = importurl
        rctx.drawImage(image, 0, 0)
        udrdrecord()
        setDataURL()
        display()
    }

})
document.querySelector('#fileurl').addEventListener('click', (e) => {
    if(fileurl == 0) {
        fileurl = 1
        document.querySelector('#importfile').toggleAttribute('hidden')
        document.querySelector('#importurl').toggleAttribute('hidden')
    } else if (fileurl == 1) {
        fileurl = 0
        document.querySelector('#importfile').toggleAttribute('hidden')
        document.querySelector('#importurl').toggleAttribute('hidden')
    }
})



// clear everything
function trash() {
    rctx.clearRect(0, 0, rwidth, rheight);
    udrdrecord()
    setDataURL()
    display()
}

function drawoff() {
    mouseStateLock = 1
}
function drawOn() {
    mouseStateLock = 0
}