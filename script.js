//Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 200;

//Variables
let fruits = [];
let score = 0;

const gravity = 0.25;

//Particle Array
let particles = [];

//Swipe Trail
let trail = [];

//Bomb Array
let bomb = [];

let lives = 3;
let gameOver = false;
//Spawn Sppen changes in every1 sec
let spawnSpeed = 1000;
let bombChance = 0.2;

//Load Images
const fruitImages = [
    "assests/apple.png",
    "assets/banaba.png",
    "assets/grapes.png",
    "assets/orange.png",
    "assets/watermelon.png",
    "assets/pineapple.png",
    "assets/strawberry.png",
    "assets/kiwi.png"
];

//Juice Explosion
function createParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(x, y, color));
    }
}

//Particle Class
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 4 + 2;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 40;
        this.color = color;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += 0.15;

        this.life--;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / 40;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

//Fruit Class
class Fruit {
    constructor() {
        this.radius = 30;
        this.x = Math.random() * (canvas.width - 100) + 500;
        this.y = canvas.height + 50;
        this.vx = (Math.random() - .5) * 8;
        this.vy = -(Math.random() * 6 + 12);
        this.color = `hsl(${Math.random() * 360},80%,60%)`;
        this.image = new Image();
        this.image.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += gravity;
    }
    draw() {
        ctx.drawImage(
            this.image,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
    }
}

//Bomb Class
class Bomb {
    constructor() {
        this.radius = 25;
        this.x = Math.random() * (canvas.width - 100) + 50;
        this.y = canvas.height + 50;
        this.vx = (Math.random() - .5) * 8;
        this.vy = -(Math.random() * 6 + 12);
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += gravity;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

//Spawn Fruit
function spawnFruit() {
    if (gameOver) return;
    if (Math.random() < bombChance) {
        bombs.push(new Bomb());
    }
    else {
        fruits.push(new Fruit());
    }
}

//Spawn Object
function spawnObject() {
    if (gameOver) return;
    if (Math.random() < bombChance) {
        bombs.push(new Bomb());
    }
    else {
        fruits.push(new Fruit());
    }
}

//Every Sec Spawn
setInterval(() => {
    if (spwanSpeed > 300) {
        spwanSpeed -= 100;
    }
    if (bombChance < 0.4) {
        bombChance += 0.03;
    }
}, 15000);

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

    trail.push({
        x: mouse.x,
        y: mouse.y
    });
    if (trail.length > 10) {
        trail.shift();
    }
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

    trail.push({
        x: mouse.x,
        y: mouse.y
    });
    if (trail.length > 10) {
        trail.shift();
    }

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
            createParticles(fruit.x, fruit.y, fruit.color);
            return false;
        }
        return true;
    });
    bombs = bombs.filter(bomb => {
        const dx = mouse.x - bomb.x;
        const dy = mouse.y - bomb.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (mouse.isDown && distance < bomb.radius) {
            gameOver = true;
            return false;
        }
        return true;
    });
}

//Update
function update() {
    fruits.forEach(fruit => fruit.update());
    //Update Particles
    particles.forEach(p => p.update());
    //Remove Dead Particles
    particles = particles.filter(p => p.life > 0);
    //Update Bombs
    bombs.forEach(bomb => bomb.update());
    //Remove Dead Bombs
    bombs = bombs.filter(bomb => bomb.y < canvas.height + 100);

    //Loose Lives
    fruits = fruits.filter(fruit => {
        if (fruit.y > canvas.height + 60) {
            lives--;
            document.getElementById("lives").textContent = lives;
            if (lives <= 0) {
                gameOver = true;
                alert("Game Over! Your Score: " + score);
            }
            return false;
        }
        return true;
    });
}

//Draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruits.forEach(fruit => fruit.draw());
    //Draw Particles
    particles.forEach(p => p.draw());
    //Draw Bombs
    bombs.forEach(bomb => bomb.draw());

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.textAlign = 'center';
        ctx.fillText("GAME OVER", canvas.width / 2, 300);
        ctx.font = "30px Arial";
        ctx.fillText("Press R to Restart", canvas.width / 2, 360);
    }
}

//Draw trail 
function drawTrail() {
    if (trail.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 255, 136, 0.5)";
    ctx.lineWidth = 5;
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
    }
    ctx.stroke();
}

//Slice Cursor
function drawCursor() {
    ctx.beginPath();
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 3;
    ctx.moveTo(mouse.x - 10, mouse.y);
    ctx.lineTo(mouse.x + 10, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 10);
    ctx.lineTo(mouse.x, mouse.y + 10);
    ctx.stroke();
}

//Game Loop Upadated
function gameLoop() {
    if (!gameOver) {
        update();
        sliceFruit();
    }
    else {
        draw();
        drawTrail();
        drawCursor();
        requestAnimationFrame(gameLoop);
    }
}
gameLoop();

//Restart Game
document.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
        fruits = [];
        bombs = [];
        particles = [];
        trail = [];
        score = 0;
        lives = 3;
        gameOver = false;
        document.getElementById("score").textContent = score;
        document.getElementById("lives").textContent = lives;
    }
});