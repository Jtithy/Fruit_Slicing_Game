const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(window.innerWidth, 600);
canvas.height = Math.min(window.innerHeight, 800);


// Sounds

const sliceSound = new Audio("assets/slice.mp3");
const bombSound = new Audio("assets/bomb.mp3");
const gameOverSound = new Audio("assets/gameover.mp3");


// Variables

let fruits = [];
let bombs = [];
let particles = [];
let trail = [];

let score = 0;
let highScore = Number(localStorage.getItem("highscore")) || 0;

let combo = 0;
let lives = 3;

let started = false;
let paused = false;
let gameOver = false;

let spawnTimer = 0;
let spawnSpeed = 60;

let bombChance = 0.2;

const gravity = 0.25;


// Display high score

document.getElementById("highscore").textContent = highScore;


// Fruit images

const fruitImages = [
    "assets/apple.png",
    "assets/banana.png",
    "assets/grapes.png",
    "assets/orange.png",
    "assets/watermelon.png",
    "assets/pineapple.png",
    "assets/strawberry.png",
    "assets/kiwi.png"
];


// Start button

document.getElementById("startBtn").onclick = () => {

    started = true;

};


// Pause

document.addEventListener("keydown", (e) => {

    if (e.key === "p" || e.key === "P") {
        paused = !paused;
    }

    if (e.key === "r" || e.key === "R") {
        restartGame();
    }

});


// Particle

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

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }

}


// Fruit

class Fruit {

    constructor() {

        this.radius = 30;

        this.x =
            Math.random() *
            (canvas.width - 100) + 50;

        this.y = canvas.height + 50;

        this.vx =
            (Math.random() - 0.5) * 8;

        this.vy =
            -(Math.random() * 6 + 12);

        this.color =
            `hsl(${Math.random() * 360},80%,60%)`;

        this.image = new Image();

        this.image.src =
            fruitImages[
            Math.floor(
                Math.random() *
                fruitImages.length
            )
            ];

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


// Bomb

class Bomb {

    constructor() {

        this.radius = 25;

        this.x =
            Math.random() *
            (canvas.width - 100) + 50;

        this.y = canvas.height + 50;

        this.vx =
            (Math.random() - 0.5) * 8;

        this.vy =
            -(Math.random() * 6 + 12);

        this.image = new Image();

        this.image.src =
            "assets/bomb.png";

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


// Spawn

function spawnObject() {

    if (Math.random() < bombChance) {

        bombs.push(new Bomb());

    } else {

        fruits.push(new Fruit());

    }

}


// Particles

function createParticles(x, y, color) {

    for (let i = 0; i < 20; i++) {

        particles.push(
            new Particle(x, y, color)
        );

    }

}


// Update

function update() {

    spawnTimer++;

    if (spawnTimer >= spawnSpeed) {

        spawnObject();

        spawnTimer = 0;

    }


    fruits.forEach(
        fruit => fruit.update()
    );

    bombs.forEach(
        bomb => bomb.update()
    );

    particles.forEach(
        particle => particle.update()
    );


    particles =
        particles.filter(
            particle => particle.life > 0
        );


    bombs =
        bombs.filter(
            bomb =>
                bomb.y <
                canvas.height + 100
        );


    fruits = fruits.filter(fruit => {

        if (
            fruit.y >
            canvas.height + 60
        ) {

            lives--;

            combo = 0;

            document
                .getElementById("combo")
                .textContent = combo;

            document
                .getElementById("lives")
                .textContent = lives;


            if (lives <= 0) {

                gameOver = true;

                gameOverSound.currentTime = 0;

                gameOverSound.play();

            }

            return false;

        }

        return true;

    });

}


// Slice

function sliceFruit() {

    if (!mouse.isDown) return;


    fruits = fruits.filter(fruit => {

        const dx =
            mouse.x - fruit.x;

        const dy =
            mouse.y - fruit.y;

        const distance =
            Math.sqrt(
                dx * dx + dy * dy
            );


        if (distance < fruit.radius) {

            combo++;

            score += 10 * combo;


            document
                .getElementById("combo")
                .textContent = combo;

            document
                .getElementById("score")
                .textContent = score;


            if (score > highScore) {

                highScore = score;

                localStorage.setItem(
                    "highscore",
                    highScore
                );

                document
                    .getElementById("highscore")
                    .textContent =
                    highScore;

            }


            createParticles(
                fruit.x,
                fruit.y,
                fruit.color
            );


            sliceSound.currentTime = 0;

            sliceSound.play();


            return false;

        }

        return true;

    });


    bombs = bombs.filter(bomb => {

        const dx =
            mouse.x - bomb.x;

        const dy =
            mouse.y - bomb.y;

        const distance =
            Math.sqrt(
                dx * dx + dy * dy
            );


        if (
            distance < bomb.radius
        ) {

            bombSound.currentTime = 0;

            bombSound.play();

            gameOver = true;

            return false;

        }

        return true;

    });

}


// Draw

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    fruits.forEach(
        fruit => fruit.draw()
    );

    bombs.forEach(
        bomb => bomb.draw()
    );

    particles.forEach(
        particle => particle.draw()
    );


    if (gameOver) {

        ctx.fillStyle =
            "rgba(0,0,0,0.7)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "white";

        ctx.textAlign = "center";

        ctx.font = "50px Arial";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            300
        );


        ctx.font = "25px Arial";

        ctx.fillText(
            "Press R to Restart",
            canvas.width / 2,
            350
        );

    }

}


// Trail

function drawTrail() {

    if (
        trail.length < 2 ||
        !mouse.isDown
    ) return;


    ctx.beginPath();

    ctx.strokeStyle =
        "rgba(0,255,136,0.7)";

    ctx.lineWidth = 5;

    ctx.moveTo(
        trail[0].x,
        trail[0].y
    );


    for (
        let i = 1;
        i < trail.length;
        i++
    ) {

        ctx.lineTo(
            trail[i].x,
            trail[i].y
        );

    }

    ctx.stroke();

}


// Cursor

function drawCursor() {

    if (!mouse.isDown) return;

    ctx.beginPath();

    ctx.strokeStyle =
        "#00ff88";

    ctx.lineWidth = 3;

    ctx.moveTo(
        mouse.x - 10,
        mouse.y
    );

    ctx.lineTo(
        mouse.x + 10,
        mouse.y
    );

    ctx.moveTo(
        mouse.x,
        mouse.y - 10
    );

    ctx.lineTo(
        mouse.x,
        mouse.y + 10
    );

    ctx.stroke();

}


// Mouse

let mouse = {
    x: 0,
    y: 0,
    isDown: false
};


canvas.addEventListener(
    "mousedown",
    () => {
        mouse.isDown = true;
    }
);


canvas.addEventListener(
    "mouseup",
    () => {

        mouse.isDown = false;

        trail = [];

    }
);


canvas.addEventListener(
    "mousemove",
    (e) => {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            e.clientX - rect.left;

        mouse.y =
            e.clientY - rect.top;


        if (mouse.isDown) {

            trail.push({
                x: mouse.x,
                y: mouse.y
            });


            if (trail.length > 10) {
                trail.shift();
            }

        }

    }
);


// Touch

canvas.addEventListener(
    "touchstart",
    (e) => {

        mouse.isDown = true;

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            e.touches[0].clientX -
            rect.left;

        mouse.y =
            e.touches[0].clientY -
            rect.top;

    }
);


canvas.addEventListener(
    "touchend",
    () => {

        mouse.isDown = false;

        trail = [];

    }
);


canvas.addEventListener(
    "touchmove",
    (e) => {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            e.touches[0].clientX -
            rect.left;

        mouse.y =
            e.touches[0].clientY -
            rect.top;


        trail.push({
            x: mouse.x,
            y: mouse.y
        });


        if (trail.length > 10) {
            trail.shift();
        }


        e.preventDefault();

    }
);


// Restart

function restartGame() {

    fruits = [];
    bombs = [];
    particles = [];
    trail = [];

    score = 0;
    combo = 0;
    lives = 3;

    spawnTimer = 0;

    gameOver = false;
    paused = false;

    document
        .getElementById("score")
        .textContent = score;

    document
        .getElementById("combo")
        .textContent = combo;

    document
        .getElementById("lives")
        .textContent = lives;

}


// Game Loop

function gameLoop() {

    if (
        started &&
        !gameOver &&
        !paused
    ) {

        update();

        sliceFruit();

    }


    draw();

    drawTrail();

    drawCursor();


    requestAnimationFrame(
        gameLoop
    );

}


gameLoop();