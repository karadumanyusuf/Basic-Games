let score = 0;
let lastHole;
let timeUp = false;
let speed = 1000;
let mode;
let timer;
let countdown;

const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreBoard = document.querySelector('#score');
const modeDisplay = document.querySelector('#current-mode');
const timeDisplay = document.querySelector('#time');
const gameOverMessage = document.querySelector('#game-over-message');
const maxHitsButton = document.querySelector('#max-hits');
const gameOverButton = document.querySelector('#game-over');
const timeSelect = document.querySelector('#time-select');
const time1mButton = document.querySelector('#time-1m');
const time2mButton = document.querySelector('#time-2m');
const time3mButton = document.querySelector('#time-3m');

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = speed;
    const hole = randomHole(holes);
    hole.querySelector('.mole').classList.add('show');
    setTimeout(() => {
        hole.querySelector('.mole').classList.remove('show');
        if (!timeUp) peep();
    }, time);
}

function startGame(selectedMode, duration) {
    mode = selectedMode;
    modeDisplay.textContent = mode;
    scoreBoard.textContent = 0;
    timeDisplay.textContent = duration / 1000;
    score = 0;
    speed = 1000;
    timeUp = false;
    gameOverMessage.classList.add('hidden');
    timeSelect.classList.add('hidden');
    peep();
    if (mode === 'Max Hits Mode') {
        countdown = duration / 1000;
        timer = setInterval(() => {
            countdown--;
            timeDisplay.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(timer);
                timeUp = true;
                showGameOverMessage();
            }
        }, 1000);
    }
}

function bonk(e) {
    if (!e.isTrusted) return; // cheater!
    score++;
    this.classList.remove('show');
    scoreBoard.textContent = score;
    speed *= 0.95; // Speed up the game
    if (mode === 'Game Over Mode') {
        // Allow the game to continue without ending on correct mole click
        return;
    }
}

function handleWrongClick(e) {
    if (mode === 'Game Over Mode' && !e.target.classList.contains('mole')) {
        // Game over only if clicking outside of a mole
        clearTimeout(timer);
        showGameOverMessage();
    }
}

function showGameOverMessage() {
    timeUp = true;
    gameOverMessage.classList.remove('hidden');
}

moles.forEach(mole => mole.addEventListener('click', bonk));
holes.forEach(hole => hole.addEventListener('click', handleWrongClick));

maxHitsButton.addEventListener('click', () => {
    timeSelect.classList.remove('hidden');
    modeDisplay.textContent = 'Max Hits Mode';
});
gameOverButton.addEventListener('click', () => startGame('Game Over Mode'));
time1mButton.addEventListener('click', () => startGame('Max Hits Mode', 60000));
time2mButton.addEventListener('click', () => startGame('Max Hits Mode', 120000));
time3mButton.addEventListener('click', () => startGame('Max Hits Mode', 180000));
