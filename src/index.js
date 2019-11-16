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
let points_angle = 135;

let bubbles_frequency = 0.15; // range(0, 1) 1 = 100% bubbles
let color_variation = 0.5; // range(0, 1) 0 = white / 1 = green

let parallax_factor = 1;
let speed_factor = 0.25;
let min_point_speed = 1;
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
        const point_size = points[id].width + points[id].length;

        const speed = Math.min(Math.max(150 / point_size * parallax_factor, min_point_speed), max_point_speed) * speed_factor;

        const direction = rotateVector({ x: 1, y: 0 }, points_angle);

        points[id].x -= direction.x * speed;
        points[id].y += direction.y * speed;

        if (points[id].x <= -(point_size + 10)) {
            points[id].x = c_width + point_size;
        }
        if (points[id].x >= c_width + point_size + 10) {
            points[id].x = -point_size;
        }

        if (points[id].y <= -(point_size + 10)) {
            points[id].y = c_height + point_size;
        }
        if (points[id].y >= c_height + point_size + 10) {
            points[id].y = -point_size;
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

function rotateVector(vector, angle) {
    angle = -angle * (Math.PI / 180);

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const result = {
        x: Math.round(10000 * (-vector.x * cos - vector.y * sin)) / 10000,
        y: Math.round(10000 * (-vector.x * sin + vector.y * cos)) / 10000
    };

    return result;
}

function drawCapsule(ctx, x, y, width, length, color) {
    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(points_angle * Math.PI / 180);

    ctx.arc(0, 0, width / 2, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(length, 0, width / 2, Math.PI * 1.5, Math.PI * 0.5);

    ctx.fill();

    ctx.restore();
}


// ======================= remove this if you want =====================

const sliders_i = document.getElementsByClassName("slider-immediately");
const sliders_r = document.getElementsByClassName("slider-restart");

for (let id = 0; id < sliders_i.length; id++) {
    sliders_i[id].addEventListener("input", SliderInputHandle);
}

for (let id = 0; id < sliders_r.length; id++) {
    sliders_r[id].addEventListener("change", SliderChangeHandle);
}

function SliderInputHandle() {
    points_angle = document.getElementById("points_angle").value;
    parallax_factor = document.getElementById("parallax_factor").value / 100;
    speed_factor = document.getElementById("speed_factor").value / 100;
    min_point_speed = document.getElementById("min_point_speed").value;
    max_point_speed = document.getElementById("max_point_speed").value;

    document.getElementById("points_angle-label").innerHTML = "points_angle: " + points_angle;
    document.getElementById("parallax_factor-label").innerHTML = "parallax_factor: " + parallax_factor;
    document.getElementById("speed_factor-label").innerHTML = "speed_factor: " + speed_factor;
    document.getElementById("min_point_speed-label").innerHTML = "min_point_speed: " + min_point_speed;
    document.getElementById("max_point_speed-label").innerHTML = "max_point_speed: " + max_point_speed;
}

function SliderChangeHandle() {
    // break loop
    enabled = false;

    points_count = document.getElementById("points_count").value;
    bubbles_frequency = document.getElementById("bubbles_frequency").value / 100;
    color_variation = document.getElementById("color_variation").value / 100;
    min_point_width = document.getElementById("min_point_width").value;
    max_point_width = document.getElementById("max_point_width").value;
    min_capsule_length = document.getElementById("min_capsule_length").value;
    max_capsule_length = document.getElementById("max_capsule_length").value;

    document.getElementById("points_count-label").innerHTML = "points_count: " + points_count;
    document.getElementById("bubbles_frequency-label").innerHTML = "bubbles_frequency: " + bubbles_frequency;
    document.getElementById("color_variation-label").innerHTML = "color_variation: " + color_variation;
    document.getElementById("min_point_width-label").innerHTML = "min_point_width: " + min_point_width;
    document.getElementById("max_point_width-label").innerHTML = "max_point_width: " + max_point_width;
    document.getElementById("min_capsule_length-label").innerHTML = "min_capsule_length: " + min_capsule_length;
    document.getElementById("max_capsule_length-label").innerHTML = "max_capsule_length: " + max_capsule_length;


    // start again
    setTimeout(OnEnable, 10);
}

// ==========================================================================

