// ===============================
// CANVAS SETUP
// ===============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth, 600);
    canvas.height = Math.min(window.innerHeight, 800);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// ===============================
// SOUNDS
// ===============================

const sliceSound = new Audio("assets/slice.mp3");
const bombSound = new Audio("assets/bomb.mp3");
const gameOverSound = new Audio("assets/gameover.mp3");


// ===============================
// GAME VARIABLES
// ===============================

let fruits = [];
let bombs = [];
let particles = [];
let trail = [];

let score = 0;
let combo = 0;
let lives = 3;

let highScore =
    Number(localStorage.getItem("highscore")) || 0;

let started = false;
let paused = false;
let gameOver = false;


// ===============================
// DIFFICULTY
// ===============================

let spawnTimer = 0;
let spawnSpeed = 60;

let bombChance = 0.15;


// ===============================
// FRUIT IMAGES
// ===============================

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


// ===============================
// DISPLAY HIGH SCORE
// ===============================

document.getElementById("highscore").textContent = highScore;


// ===============================
// MOUSE
// ===============================

let mouse = {
    x: 0,
    y: 0,
    isDown: false
};


// ===============================
// START BUTTON
// ===============================

document.getElementById("startBtn").onclick = () => {

    started = true;
    paused = false;
    gameOver = false;

    document.getElementById("startBtn").style.display = "none";
};


// ===============================
// PARTICLE CLASS
// ===============================

class Particle {

    constructor(x, y, color) {

        this.x = x;
        this.y = y;

        this.radius = Math.random() * 4 + 2;

        this.vx =
            (Math.random() - 0.5) * 8;

        this.vy =
            (Math.random() - 0.5) * 8;

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

        ctx.globalAlpha =
            this.life / 40;

        ctx.fillStyle = this.color;

        ctx.beginPath();

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


// ===============================
// CREATE PARTICLES
// ===============================

function createParticles(x, y, color) {

    for (let i = 0; i < 20; i++) {

        particles.push(
            new Particle(
                x,
                y,
                color
            )
        );
    }
}


// ===============================
// FRUIT CLASS
// ===============================

class Fruit {

    constructor() {

        this.radius = 30;

        this.x =
            Math.random() *
            (canvas.width - 100) +
            50;

        this.y =
            canvas.height + 50;

        this.vx =
            (Math.random() - 0.5) * 8;

        this.vy =
            -(Math.random() * 6 + 12);

        this.color =
            `hsl(${Math.random() * 360}, 80%, 60%)`;

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

        this.vy += 0.25;
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


// ===============================
// BOMB CLASS
// ===============================

class Bomb {

    constructor() {

        this.radius = 25;

        this.x =
            Math.random() *
            (canvas.width - 100) +
            50;

        this.y =
            canvas.height + 50;

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

        this.vy += 0.25;
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


// ===============================
// SPAWN OBJECT
// ===============================

function spawnObject() {

    if (Math.random() < bombChance) {

        bombs.push(
            new Bomb()
        );

    } else {

        fruits.push(
            new Fruit()
        );
    }
}


// ===============================
// MOUSE EVENTS
// ===============================

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

            if (trail.length > 12) {
                trail.shift();
            }
        }
    }
);


// ===============================
// TOUCH EVENTS
// ===============================

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

        if (mouse.isDown) {

            trail.push({
                x: mouse.x,
                y: mouse.y
            });

            if (trail.length > 12) {
                trail.shift();
            }
        }

        e.preventDefault();
    },
    { passive: false }
);


// ===============================
// SLICE FRUIT
// ===============================

function sliceFruit() {

    if (!mouse.isDown) {
        return;
    }


    // FRUITS

    fruits = fruits.filter(
        (fruit) => {

            const dx =
                mouse.x - fruit.x;

            const dy =
                mouse.y - fruit.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                fruit.radius
            ) {

                combo++;

                score +=
                    10 * combo;


                document.getElementById(
                    "score"
                ).textContent = score;


                document.getElementById(
                    "combo"
                ).textContent = combo;


                if (score > highScore) {

                    highScore = score;

                    localStorage.setItem(
                        "highscore",
                        highScore
                    );

                    document.getElementById(
                        "highscore"
                    ).textContent =
                        highScore;
                }


                createParticles(
                    fruit.x,
                    fruit.y,
                    fruit.color
                );


                sliceSound.currentTime = 0;

                sliceSound.play().catch(
                    () => { }
                );


                return false;
            }

            return true;
        }
    );


    // BOMBS

    bombs = bombs.filter(
        (bomb) => {

            const dx =
                mouse.x - bomb.x;

            const dy =
                mouse.y - bomb.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                bomb.radius
            ) {

                bombSound.currentTime = 0;

                bombSound.play().catch(
                    () => { }
                );

                gameOver = true;

                return false;
            }

            return true;
        }
    );
}


// ===============================
// UPDATE GAME
// ===============================

function update() {

    // SPAWN

    spawnTimer++;

    if (spawnTimer >= spawnSpeed) {

        spawnObject();

        spawnTimer = 0;
    }


    // FRUITS

    fruits.forEach(
        fruit => fruit.update()
    );


    // BOMBS

    bombs.forEach(
        bomb => bomb.update()
    );


    // PARTICLES

    particles.forEach(
        particle => particle.update()
    );


    // REMOVE PARTICLES

    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );


    // REMOVE BOMBS

    bombs =
        bombs.filter(
            bomb =>
                bomb.y <
                canvas.height + 100
        );


    // MISSED FRUITS

    fruits =
        fruits.filter(
            fruit => {

                if (
                    fruit.y >
                    canvas.height + 60
                ) {

                    lives--;


                    document.getElementById(
                        "lives"
                    ).textContent =
                        lives;


                    combo = 0;

                    document.getElementById(
                        "combo"
                    ).textContent =
                        combo;


                    if (lives <= 0) {

                        gameOver = true;

                        gameOverSound.currentTime = 0;

                        gameOverSound.play().catch(
                            () => { }
                        );
                    }


                    return false;
                }

                return true;
            }
        );
}


// ===============================
// DRAW GAME
// ===============================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // FRUITS

    fruits.forEach(
        fruit => fruit.draw()
    );


    // BOMBS

    bombs.forEach(
        bomb => bomb.draw()
    );


    // PARTICLES

    particles.forEach(
        particle => particle.draw()
    );


    // GAME OVER

    if (gameOver) {

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.65)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "white";

        ctx.textAlign =
            "center";


        ctx.font =
            "50px Arial";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            canvas.height / 2 - 30
        );


        ctx.font =
            "25px Arial";

        ctx.fillText(
            "Press R to Restart",
            canvas.width / 2,
            canvas.height / 2 + 30
        );
    }
}


// ===============================
// DRAW SWORD TRAIL
// ===============================

function drawTrail() {

    if (
        !mouse.isDown ||
        trail.length < 2
    ) {
        return;
    }


    ctx.beginPath();

    ctx.strokeStyle =
        "rgba(255, 255, 255, 0.8)";

    ctx.lineWidth = 5;

    ctx.lineCap = "round";

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


// ===============================
// DRAW CURSOR
// ===============================

function drawCursor() {

    if (!mouse.isDown) {
        return;
    }


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


// ===============================
// PAUSE
// ===============================

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "p" ||
            e.key === "P"
        ) {

            if (started && !gameOver) {

                paused = !paused;
            }
        }
    }
);


// ===============================
// RESTART
// ===============================

function restartGame() {

    fruits = [];
    bombs = [];
    particles = [];
    trail = [];

    score = 0;
    combo = 0;
    lives = 3;

    spawnTimer = 0;

    spawnSpeed = 60;
    bombChance = 0.15;

    gameOver = false;
    paused = false;
    started = true;


    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "lives"
    ).textContent = lives;


    document.getElementById(
        "combo"
    ).textContent = combo;
}


// ===============================
// RESTART WITH R
// ===============================

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "r" ||
            e.key === "R"
        ) {

            if (gameOver) {

                restartGame();
            }
        }
    }
);


// ===============================
// DIFFICULTY INCREASE
// ===============================

setInterval(
    () => {

        if (!started || gameOver) {
            return;
        }


        if (spawnSpeed > 25) {

            spawnSpeed -= 5;
        }


        if (bombChance < 0.4) {

            bombChance += 0.03;
        }

    },
    15000
);


// ===============================
// GAME LOOP
// ===============================

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