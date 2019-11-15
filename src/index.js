const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

canvas.width = width;
canvas.height = 500;

const c_width = canvas.width;
const c_height = canvas.height;

const points = [];

const bubbles_frequency = 0.15; // range(0, 1) 1 = 100% bubbles
const max_points_count = 50;
const min_point_width = 20;
const min_capsule_length = 20;
const max_point_speed = 5;

// initialization
function Start() {

    // Instantiate points
    for (let id = 0; id < max_points_count; id++) {
        const scale = Math.random() * 100;

        points.push({
            // random position
            x: Math.random() * c_width,
            y: Math.random() * c_height,
            // random scale
            width: Math.max(scale, min_point_width),
            length: Math.random() <= bubbles_frequency ? 0 : Math.max(Math.random() * 150, min_capsule_length) + scale,
            // random color
            color: Math.random() >= 0.5 ? "rgba(40, 167, 69, 0.05)" : "rgba(255, 255, 255, 0.1)"
        });
    }
}

// loop every frame
function Update() {
    // transform.Translate(1px, 1px)
    for (let id = 0; id < max_points_count; id++) {
        if (points[id].length > 10) {
            const speed = Math.min(100 / points[id].length, max_point_speed);
            points[id].x -= speed;
            points[id].y += speed;
        }
        else {
            const speed = Math.min(100 / points[id].width, max_point_speed);
            points[id].x -= speed;
            points[id].y += speed;
        }

        if (points[id].x <= -(points[id].width + 100)) {
            points[id].x = c_width + 100;
        }

        if (points[id].y >= c_height + 100) {
            points[id].y = -points[id].length - 10;
        }
    }

    Repaint();
    requestAnimationFrame(Update);
}

function Repaint() {
    // clear canvas
    // context.clearRect(0, 0, c_width, c_height);

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

// MonoBehaviour Awake() =]
Start();
Update();