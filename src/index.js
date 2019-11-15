const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

canvas.width = width;
canvas.height = 500;

const c_width = canvas.width;
const c_height = canvas.height;

const points = [];
const max_points_count = 50;

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
            width: 10 + scale,
            length: Math.random() * 150 + scale,
            // random color
            color: Math.random() >= 0.5 ? "rgba(40, 167, 69, 0.05)" : "rgba(255, 255, 255, 0.1)"
        });
    }
}

// loop every frame
function Update() {
    // transform.Translate(1px, 1px)
    for (let id = 0; id < max_points_count; id++) {
        points[id].x -= 100 / points[id].length;
        points[id].y += 100 / points[id].length;

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