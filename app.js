"use strict";

document.addEventListener("keydown", moveDoodler);
const startButton = document.createElement("button");
const logo = document.createElement("div");
const grid = document.querySelector(".grid");
const doodler = document.createElement("div");
const scoreBoard = document.createElement("div");
let doodlerLeft = 50;
let doodlerBottom = 150;
let score = 0;
let gameOver = false;
let platformCount = 5;
let canvasHeight = 600;
let platforms = [];
let buttonTimerId;
let upTimerId;
let downTimerId;
let platformWidth = 65;
let currentHeight;
let isJumping = false;
let jumpSound = new Audio("./assets/jump-arcade.mp3");
jumpSound.volume = 0.5;
function getRandomPad() {
    return Math.floor(Math.random() * 4) + 1;
}

function randomX() {
    return Math.floor(Math.random() * 315);
}

function hideAndStart() {
    startButton.classList.toggle("hide");
    logo.classList.toggle("hide");
    clearInterval(buttonTimerId);
    gameOver = false;
    start();
}

function startScreen() {
    logo.classList.add("logo");
    logo.classList.add("animate__animated");
    logo.classList.add("animate__backInDown");
    startButton.classList.add("start");
    startButton.classList.add("animate__animated");
    buttonTimerId = setInterval(() => {
        startButton.classList.toggle("animate__rubberBand");
    }, 2000);
    startButton.textContent = "Play";
    grid.appendChild(startButton);
    grid.appendChild(logo);
    startButton.addEventListener("click", hideAndStart);
}

function createScoreboard() {
    scoreBoard.textContent = `Score: ${score}`;
    scoreBoard.classList.add("score");
    grid.appendChild(scoreBoard);
}

function createDoodler() {
    doodler.innerHTML = "<img src='./assets/DoodlerR.png' width='100%'>";
    doodler.classList.add("doodler");
    grid.appendChild(doodler);
    doodler.style.left = `${doodlerLeft}px`;
    doodler.style.bottom = `${doodlerBottom}px`;
}

function Platform(platformBottom) {
    this.bottom = platformBottom;
    this.left = Math.floor(Math.random() * 315);
    this.visual = document.createElement("div");

    const visual = this.visual;
    visual.classList.add("platform");
    visual.innerHTML = `<img src='./assets/pad1.png' width='100%'>`;
    visual.style.left = `${this.left}px`;
    visual.style.bottom = `${this.bottom}px`;
    grid.appendChild(visual);
}

function createPlatform() {
    for (let i = 0; i < platformCount; i++) {
        let platformGap = canvasHeight / platformCount;
        let platformBottom = 100 + i * platformGap;
        let pad = new Platform(platformBottom);
        platforms.push(pad);
    }
}

function moveDoodler(e) {
    if (doodlerLeft >= 0) {
        if (e.key === "ArrowLeft") {
            doodlerLeft -= 5;
            createDoodler();
            doodler.firstElementChild.setAttribute(
                "src",
                "./assets/DoodlerL.png"
            );
        }
    }
    if (doodlerLeft < 342) {
        if (e.key === "ArrowRight") {
            doodlerLeft += 5;
            createDoodler();
            doodler.firstElementChild.setAttribute(
                "src",
                "./assets/DoodlerR.png"
            );
        }
    }
    // createDoodler();
}

function movePlatforms() {
    if (doodlerBottom > 200) {
        platforms.forEach((platform) => {
            platform.bottom -= 4;
            let visual = platform.visual;
            visual.style.bottom = `${platform.bottom}px`;
        });
    }
}

function gameover() {
    clearInterval(downTimerId);
    gameOver = true;
}

function fall() {
    isJumping = false;
    clearInterval(upTimerId);
    downTimerId = setInterval(() => {
        doodlerBottom -= 5;
        doodler.style.bottom = doodlerBottom + "px";
        if (doodlerBottom <= 0) {
            gameover();
        }
    }, 30);
}

function jump() {
    if (onPlatform && !isJumping) {
        clearInterval(downTimerId);
        currentHeight = doodlerBottom;
        isJumping = true;
        jumpSound.play();

        upTimerId = setInterval(function () {
            doodlerBottom += 20;
            doodler.style.bottom = doodlerBottom + "px";
            if (doodlerBottom > currentHeight + 200) {
                fall();
            }
        }, 30);
    }
}
function onPlatform() {
    platforms.forEach((platform) => {
        if (
            doodlerBottom >= platform.bottom &&
            doodlerBottom <= platform.bottom + 15 &&
            doodlerLeft + 40 >= platform.left &&
            doodlerLeft <= platform.left + platformWidth &&
            !isJumping
        ) {
            jump();
            score += 100;
            createScoreboard();
        }
        // Reset platform  Add random x later
        if (platform.bottom < 0) {
            platform.bottom = 650;
        }
    });
}

function start() {
    if (!gameOver) {
        createPlatform();
        doodlerLeft = platforms[0].left;
        createDoodler();
        createScoreboard();
        setInterval(movePlatforms, 30);
        setInterval(onPlatform, 30);
        jump();
    }
}
startScreen();
