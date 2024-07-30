const boardSize = 20;
const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const gameOverPopup = document.getElementById('game-over-popup');
const finalScoreDisplay = document.getElementById('final-score');
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: -1 };
let food = { x: 5, y: 5 };
let score = 0;

function initBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
    }
}

function draw() {
    board.innerHTML = '';
    initBoard();
    snake.forEach(segment => {
        const cell = board.children[segment.y * boardSize + segment.x];
        cell.classList.add('snake');
    });
    const foodCell = board.children[food.y * boardSize + food.x];
    foodCell.classList.add('food');
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    };
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    }
}

function update() {
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Kenardan geçiş
    if (head.x < 0) head.x = boardSize - 1;
    else if (head.x >= boardSize) head.x = 0;
    if (head.y < 0) head.y = boardSize - 1;
    else if (head.y >= boardSize) head.y = 0;

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `Skor: ${score}`;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y !== 1) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y !== -1) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x !== -1) direction = { x: 1, y: 0 };
            break;
    }
}

function gameOver() {
    finalScoreDisplay.textContent = `Senin Skorun: ${score}`;
    gameOverPopup.classList.remove('hidden');
}

function restartGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: -1 };
    score = 0;
    scoreDisplay.textContent = `Skor: ${score}`;
    gameOverPopup.classList.add('hidden');
    spawnFood();
    draw();
}

document.addEventListener('keydown', changeDirection);
setInterval(update, 200);

initBoard();
draw();
spawnFood();
