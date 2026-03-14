const COLORS = ["#174EA6", "#4285F4", "#EA4335", "#FBBC04", "#34A853", "#D2E3FC", "#FAD2CF", "#FEEFC3", "#CEEAD6"];
const FRAME_RATE = 60;
let ANIMATING = true;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");

function initialize() {
    ANIMATING = true;
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.style.height = `${HEIGHT}px`;
    canvas.style.width = `${WIDTH}px`;
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    animate();
}
let timerId = null;
function animate() {
    if (!ANIMATING) return;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    timerId = setTimeout(() => {
        animate();
    }, 1000 / FRAME_RATE);
}
initialize();
window.addEventListener("resize", () => {
    ANIMATING = false;
    clearTimeout(timerId);
    initialize();
})