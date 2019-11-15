const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

canvas.width = width;
canvas.height = 500;

const c_width = canvas.width;
const c_height = canvas.height;

let enabled = false;

let points = [];

let points_count = 50;
let bubbles_frequency = 0.15; // range(0, 1) 1 = 100% bubbles
let color_variation = 0.5; // range(0, 1) 0 = white / 1 = green

let speed_factor = 0.25;
let max_point_speed = 5;

let min_point_width = 40;
let max_point_width = 100;

let min_capsule_length = 20;
let max_capsule_length = 150;


// MonoBehaviour Awake() =]
document.addEventListener("DOMContentLoaded", OnEnable);

// initialization
function OnEnable() {
    enabled = true;
    Start();
    Update();
}

// initialization
function Start() {
    points = [];

    // Instantiate points
    for (let id = 0; id < points_count; id++) {

        points.push({
            // random position
            x: Math.random() * c_width,
            y: Math.random() * c_height,
            // random scale
            width: Math.max(Math.random() * max_point_width, min_point_width),
            length: (id + 1) / points_count <= bubbles_frequency ? 0 : Math.max(Math.random() * max_capsule_length, min_capsule_length),
            // random color
            color: (id + 1) / points_count <= color_variation ? "rgba(40, 167, 69, 0.05)" : "rgba(255, 255, 255, 0.05)"
        });
    }
}

// loop every frame
function Update() {
    // transform.Translate(1px, 1px)
    for (let id = 0; id < points_count; id++) {
        if (points[id].length > 10) {
            const speed = Math.min(100 / points[id].length, max_point_speed) * speed_factor;
            points[id].x -= speed;
            points[id].y += speed;
        }
        else {
            const speed = Math.min(100 / points[id].width, max_point_speed) * speed_factor;
            points[id].x -= speed;
            points[id].y += speed;
        }

        if (points[id].x <= -(points[id].width + 100)) {
            points[id].x = c_width + points[id].width;
        }

        if (points[id].y >= c_height + 100) {
            points[id].y = -points[id].length - points[id].width;
        }
    }

    Repaint();

    if (enabled) {
        requestAnimationFrame(Update);
    }
}

function Repaint() {
    // clear canvas
    // ctx.clearRect(0, 0, c_width, c_height);

    // draw background
    ctx.fillStyle = '#1D2F34';
    ctx.fillRect(0, 0, c_width, c_height);

    // draw all capsules
    points.forEach((point) => {
        drawCapsule(ctx, point.x, point.y, point.width, point.length, point.color);
    });
}

function drawCapsule(ctx, x, y, width, length, color) {
    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(135 * Math.PI / 180);

    ctx.arc(0, 0, width / 2, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(length, 0, width / 2, Math.PI * 1.5, Math.PI * 0.5);

    ctx.fill();

    ctx.restore();
}


// ======================= remove this if you want =====================

const sliders = document.getElementsByClassName("slider");

for (let id = 0; id < sliders.length; id++) {
    sliders[id].addEventListener("change", SliderHandle);
}

function SliderHandle() {
    // break loop
    enabled = false;

    bubbles_frequency = document.getElementById("bubbles_frequency").value / 100;
    color_variation = document.getElementById("color_variation").value / 100;
    points_count = document.getElementById("points_count").value;
    speed_factor = document.getElementById("speed_factor").value / 100;
    max_point_speed = document.getElementById("max_point_speed").value;
    min_point_width = document.getElementById("min_point_width").value;
    max_point_width = document.getElementById("max_point_width").value;
    min_capsule_length = document.getElementById("min_capsule_length").value;
    max_capsule_length = document.getElementById("max_capsule_length").value;

    document.getElementById("points_count-label").innerHTML = "points_count: " + points_count;
    document.getElementById("bubbles_frequency-label").innerHTML = "bubbles_frequency: " + bubbles_frequency;
    document.getElementById("color_variation-label").innerHTML = "color_variation: " + color_variation;
    document.getElementById("speed_factor-label").innerHTML = "speed_factor: " + speed_factor;
    document.getElementById("max_point_speed-label").innerHTML = "max_point_speed: " + max_point_speed;
    document.getElementById("min_point_width-label").innerHTML = "min_point_width: " + min_point_width;
    document.getElementById("max_point_width-label").innerHTML = "max_point_width: " + max_point_width;
    document.getElementById("min_capsule_length-label").innerHTML = "min_capsule_length: " + min_capsule_length;
    document.getElementById("max_capsule_length-label").innerHTML = "max_capsule_length: " + max_capsule_length;

    // start again
    setTimeout(OnEnable, 10);
}

// ==========================================================================

