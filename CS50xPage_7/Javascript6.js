function hidec() {
    document.querySelector("#cicadafr").setAttribute("style", "display:block");
    document.querySelector("#snakeEyesfr").setAttribute("style", "display:none");
}
function hides() {
    document.querySelector("#snakeEyesfr").setAttribute("style", "display:block");
    document.querySelector("#cicadafr").setAttribute("style", "display:none");
}
hidec();

function rngpurp() {
    document.querySelector("html").style.backgroundColor = ("#" + Math.floor((Math.random() * 156) + 100).toString(16) + "00" + Math.floor((Math.random() * 156) + 100).toString(16));
}