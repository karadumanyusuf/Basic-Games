const width = 10;
const height = 10;
const minesCount = 20;
let gameContainer = document.getElementById('game-container');
let scoreElement = document.getElementById('score');
let timerElement = document.getElementById('timer');
let gameOverPopup = document.getElementById('game-over-popup');
let finalScoreElement = document.getElementById('final-score');
let finalTimeElement = document.getElementById('final-time');
let restartButton = document.getElementById('restart-button');
let cells = [];
let isGameOver = false;
let score = 0;
let timer = 0;
let timerInterval;

restartButton.addEventListener('click', initializeGame);

// Initialize the game
function initializeGame() {
    gameContainer.innerHTML = ''; // Clear previous game
    gameOverPopup.classList.add('hidden');
    cells = [];
    isGameOver = false;
    score = 0;
    timer = 0;
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `Time: ${timer}`;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    // Create cells
    for (let i = 0; i < width * height; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('id', i);
        cell.addEventListener('click', () => clickCell(cell));
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            flagCell(cell);
        });
        gameContainer.appendChild(cell);
        cells.push(cell);
    }

    // Place mines
    let mines = Array(minesCount).fill('mine');
    let empty = Array(width * height - minesCount).fill('empty');
    let gameArray = empty.concat(mines);
    gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < gameArray.length; i++) {
        cells[i].classList.add(gameArray[i]);
    }

    // Add numbers
    for (let i = 0; i < cells.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (cells[i].classList.contains('empty')) {
            if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('mine')) total++;
            if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('mine')) total++;
            if (i > 10 && cells[i - width].classList.contains('mine')) total++;
            if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('mine')) total++;
            if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('mine')) total++;
            if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('mine')) total++;
            if (i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('mine')) total++;
            if (i < 89 && cells[i + width].classList.contains('mine')) total++;

            if (total > 0) {
                cells[i].setAttribute('data', total);
                cells[i].classList.add(`cell-${total}`);
            }
        }
    }
}

// Update timer
function updateTimer() {
    if (!isGameOver) {
        timer++;
        timerElement.textContent = `Time: ${timer}`;
    }
}

// Handle cell click
function clickCell(cell) {
    if (isGameOver) return;
    if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) return;

    if (cell.classList.contains('mine')) {
        cell.classList.add('revealed');
        cell.innerHTML = '💣';
        gameOver();
    } else {
        const total = cell.getAttribute('data');
        if (total != null) {
            cell.classList.add('revealed');
            cell.innerHTML = total;
            score += parseInt(total);
            scoreElement.textContent = `Score: ${score}`;
        } else {
            revealCell(cell);
        }
    }
}

// Handle cell flagging
function flagCell(cell) {
    if (isGameOver) return;
    if (!cell.classList.contains('revealed')) {
        cell.classList.toggle('flagged');
    }
}

// Reveal cell
function revealCell(cell) {
    if (cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');

    let id = parseInt(cell.id);
    const isLeftEdge = (id % width === 0);
    const isRightEdge = (id % width === width - 1);

    setTimeout(() => {
        if (id > 0 && !isLeftEdge) clickCell(cells[id - 1]);
        if (id > 9 && !isRightEdge) clickCell(cells[id + 1 - width]);
        if (id > 10) clickCell(cells[id - width]);
        if (id > 11 && !isLeftEdge) clickCell(cells[id - 1 - width]);
        if (id < 98 && !isRightEdge) clickCell(cells[id + 1]);
        if (id < 90 && !isLeftEdge) clickCell(cells[id - 1 + width]);
        if (id < 88 && !isRightEdge) clickCell(cells[id + 1 + width]);
        if (id < 89) clickCell(cells[id + width]);
    }, 10);
}

// Game over
function gameOver() {
    isGameOver = true;
    clearInterval(timerInterval);
    cells.forEach(cell => {
        if (cell.classList.contains('mine')) {
            cell.classList.add('revealed');
            cell.innerHTML = '💣';
        }
    });
    finalScoreElement.textContent = `Final Score: ${score}`;
    finalTimeElement.textContent = `Final Time: ${timer} seconds`;
    gameOverPopup.classList.remove('hidden');
}

initializeGame();
