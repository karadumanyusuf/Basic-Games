document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#game-grid');
    const startButtonPopup = document.querySelector('#start-button-popup');
    const restartButton = document.querySelector('#restart-button');
    const scoreDisplay = document.querySelector('#score');
    const timeDisplay = document.querySelector('#time');
    const finalScoreDisplay = document.querySelector('#final-score');
    const finalTimeDisplay = document.querySelector('#final-time');
    const startPopup = document.querySelector('#start-popup');
    const gameOverPopup = document.querySelector('#gameover-popup');
    const width = 15;
    let timerId;
    let score = 0;
    let time = 0;
    let gameInterval;
    let currentPosition = 4;
    let currentRotation = 0;
    let random;
    let current;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan'];

    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    // Create the game grid
    function createGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 450; i++) {
            const square = document.createElement('div');
            grid.appendChild(square);
        }
        for (let i = 0; i < 15; i++) {
            const takenSquare = document.createElement('div');
            takenSquare.classList.add('taken');
            grid.appendChild(takenSquare);
        }
    }

    // draw the Tetromino
    function draw() {
        current.forEach(index => {
            grid.children[currentPosition + index].classList.add('tetromino');
            grid.children[currentPosition + index].style.backgroundColor = colors[random];
        });
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            grid.children[currentPosition + index].classList.remove('tetromino');
            grid.children[currentPosition + index].style.backgroundColor = '';
        });
    }

    // move the tetromino down every second
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // freeze the tetromino
    function freeze() {
        if (current.some(index => grid.children[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => grid.children[currentPosition + index].classList.add('taken'));
            random = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            addScore();
            gameOver();
        }
    }

    // move the tetromino left, unless at the edge or there is a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => grid.children[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // move the tetromino right, unless at the edge or there is a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => grid.children[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // rotate the tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === theTetrominoes[random].length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // add score
    function addScore() {
        for (let i = 0; i < 435; i += width) {
            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(i + j);
            }
            if (row.every(index => grid.children[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    grid.children[index].classList.remove('taken');
                    grid.children[index].classList.remove('tetromino');
                    grid.children[index].style.backgroundColor = '';
                });
                const squaresRemoved = Array.from(grid.children).splice(i, width);
                grid.prepend(...squaresRemoved);
            }
        }
    }

    // game over
    function gameOver() {
        if (current.some(index => grid.children[currentPosition + index].classList.contains('taken'))) {
            clearInterval(timerId);
            clearInterval(gameInterval);
            finalScoreDisplay.innerHTML = score;
            finalTimeDisplay.innerHTML = time;
            gameOverPopup.style.display = 'flex';
        }
    }

    // start button
    function startGame() {
        createGrid();
        startPopup.style.display = 'none';
        gameOverPopup.style.display = 'none';
        score = 0;
        time = 0;
        scoreDisplay.innerHTML = score;
        timeDisplay.innerHTML = time;
        random = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        timerId = setInterval(moveDown, 1000);
        gameInterval = setInterval(() => {
            time++;
            timeDisplay.innerHTML = time;
        }, 1000);
    }

    // restart button
    function restartGame() {
        Array.from(grid.children).forEach(child => child.classList.remove('taken', 'tetromino'));
        clearInterval(timerId);
        clearInterval(gameInterval);
        startGame();
    }

    startButtonPopup.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);

    // assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    // Display start popup on page load
    startPopup.style.display = 'flex';
});
