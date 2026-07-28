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