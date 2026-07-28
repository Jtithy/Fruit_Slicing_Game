//Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 200;

//Variables
let fruits = [];
let score = 0;

const gravity = 0.25;

//Fruit Class
class Fruit {
    constructor() {
        this.radius = 30;
        this.x = Math.random() * (canvas.width - 100) + 500;
        this.y = canvas.height + 50;
        this.vx = (Math.random() - .5) * 8;
        this.vy = -(Math.random() * 6 + 12);
        this.color = `hsl(${Math.random() * 360},80%,60%)`;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += gravity;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

//Spawn Fruit
function spawnFruit() {
    fruits.push(new Fruit());
}

//Every Sec Spawn
setInterval(spawnFruit, 1000);

//Update
function update() {
    fruits.forEach(fruit => fruit.update());
    fruits = fruits.filter(fruit => fruit.y < canvas.height + 100);
}

//Draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruits.forEach(fruit => fruit.draw());
}

//Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

//Function call
gameLoop();

//Mouse Position
let mouse = {
    x: 0,
    y: 0,
    isDown: false
};

//Events
canvas.addEventListener("mousedown", () => {
    mouse.isDown = true;
});

canvas.addEventListener("mouseup", () => {
    mouse.isDown = false;
});

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

//Touch Events
canvas.addEventListener("touchstart", () => {
    mouse.isDown = true;
});

canvas.addEventListener("touchend", () => {
    mouse.isDown = false;
});

canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();

    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;

    e.preventDefault();
});

//Slice Fruit
function sliceFruit() {
    if (!mouse.isDown) return;
    fruits = fruits.filter(fruit => {
        const dx = mouse.x - fruit.x;
        const dy = mouse.y - fruit.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < fruit.radius) {
            score += 10;
            document.getElementById("score").textContent = score;
            return false;
        }
        return true;
    });
}

