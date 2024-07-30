// scripts.js
let sequence = [];
let userSequence = [];
let level = 0;
let score = 0;
const colors = ['green', 'red', 'yellow', 'blue'];

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('play-again-button').addEventListener('click', startGame);

function startGame() {
    level = 0;
    score = 0;
    sequence = [];
    userSequence = [];
    updateScore();
    hideGameOver();
    nextLevel();
}

function nextLevel() {
    level++;
    userSequence = [];
    sequence.push(colors[Math.floor(Math.random() * 4)]);
    playSequence();
}

function playSequence() {
    let delay = 0;
    sequence.forEach((color, index) => {
        setTimeout(() => {
            playSound(color);
            flashButton(color);
        }, delay);
        delay += 1000;
    });
}

function flashButton(color) {
    const button = document.getElementById(color);
    button.style.opacity = 1;
    setTimeout(() => {
        button.style.opacity = 0.6;
    }, 500);
}

function playSound(color) {
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
}

document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', event => {
        const color = event.target.id;
        userSequence.push(color);
        playSound(color);
        flashButton(color);
        checkSequence();
    });
});

function checkSequence() {
    const currentLevel = userSequence.length - 1;
    if (userSequence[currentLevel] !== sequence[currentLevel]) {
        showGameOver();
        return;
    }
    if (userSequence.length === sequence.length) {
        score++;
        updateScore();
        setTimeout(nextLevel, 1000);
    }
}

function updateScore() {
    document.getElementById('score').textContent = 'Score: ' + score;
}

function showGameOver() {
    document.getElementById('final-score').textContent = 'Game Over! Your final score is ' + score;
    document.getElementById('game-over').classList.remove('hidden');
}

function hideGameOver() {
    document.getElementById('game-over').classList.add('hidden');
}
