const COLORS = [
    "#ecfdf5",
    "#d1fae5",
    "#a7f3d0",
    "#6ee7b7",
    "#34d399",
    "#10b981",
    "#059669",
    "#047857",
    "#065f46",
    "#064e3b",
    "#022c22"
];

const FRAME_RATE = 60;
const LAYER_COUNT = 3;

let ANIMATING = true;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let time = 0;

class Wave {
    constructor(height, direction, amplitudeArray, phaseArray, frequencyArray, color) {
        this.amplitudeArray = amplitudeArray;
        this.phaseArray = phaseArray;
        this.frequencyArray = frequencyArray;
        this.height = height;
        this.direction = direction;
        this.color = color;
    }
    computeC(theta) {
        const a = WIDTH/2 - this.height;
        const b = HEIGHT/2 - this.height;
        return Math.max(
            Math.abs(a * Math.cos(theta)),
            Math.abs(b * Math.sin(theta))
        );
    }
    draw() {
        const theta = this.direction;
        const nx = Math.cos(theta);
        const ny = Math.sin(theta);
        const tx = -Math.sin(theta);
        const ty = Math.cos(theta);
        const c = this.computeC(theta);
        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;

        context.beginPath();

        const length = Math.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT);
        const steps = 600;

        let firstX, firstY, lastX, lastY;

        for (let i = -steps; i <= steps; i++) {
            const s = (i/steps)*length;
            let displacement = 0;
            for (let j=0; j<this.amplitudeArray.length; j++) {
                displacement +=
                    this.amplitudeArray[j] *
                    Math.sin(
                        s*this.frequencyArray[j] +
                        time*(0.5 + j*0.3) +
                        this.phaseArray[j]
                    );
            }
            const baseX = centerX + nx*c + tx*s;
            const baseY = centerY + ny*c + ty*s;
            const x = baseX + nx*displacement;
            const y = baseY + ny*displacement;
            if (i === -steps) {
                context.moveTo(x, y);
                firstX = x;
                firstY = y;
            } else {
                context.lineTo(x, y);
            }
            if (i===steps) {
                lastX = x;
                lastY = y;
            }
        }
        const extend = Math.max(WIDTH, HEIGHT) * 2;
        context.lineTo(lastX + nx*extend, lastY + ny*extend);
        context.lineTo(firstX + nx*extend, firstY + ny*extend);
        context.closePath();
        context.fillStyle = this.color+"50";
        context.fill();
    }
}

const waves = [];
function createWaves() {
    waves.length = 0;
    const direction = -Math.PI*3/4;
    for (let i=0; i<LAYER_COUNT; i++) {
        const depth = i/LAYER_COUNT;
        waves.push(
            new Wave(
                WIDTH/40 + i*HEIGHT/10,
                direction,
                [
                    15*(1-depth),
                    10*(1-depth),
                    5*(1-depth)
                ],
                [
                    Math.random()*Math.PI,
                    Math.random()*Math.PI,
                    Math.random()*Math.PI
                ],
                [
                    0.005,
                    0.015,
                    0.025
                ],
                COLORS[COLORS.length-1-i*2]
            )
        );
    }
    const oppDirection = Math.PI/4;
    for (let i=0; i<LAYER_COUNT; i++) {
        const depth = i/LAYER_COUNT;
        waves.push(
            new Wave(
                WIDTH/40 + i*HEIGHT/10,
                oppDirection,
                [
                    15*(1-depth),
                    10*(1-depth),
                    5*(1-depth)
                ],
                [
                    Math.random()*Math.PI,
                    Math.random()*Math.PI,
                    Math.random()*Math.PI
                ],
                [
                    0.005,
                    0.015,
                    0.025
                ],
                COLORS[COLORS.length-1-i*2]
            )
        );
    }
}

function initialize() {
    ANIMATING = true;
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.style.height = `${HEIGHT}px`;
    canvas.style.width = `${WIDTH}px`;
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    createWaves();
    animate();
}

let timerId = null;

function animate() {
    if (!ANIMATING) return;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    time += 0.02;
    waves.forEach(w => w.draw());
    timerId = setTimeout(() => {
        animate();
    }, 1000 / FRAME_RATE);
}

initialize();

window.addEventListener("resize", () => {
    ANIMATING = false;
    clearTimeout(timerId);
    initialize();
});