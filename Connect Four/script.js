const rows = 6;
const cols = 7;
let currentPlayer = 'red';
let board = [];
let player1Name = '';
let player2Name = '';

const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const startButton = document.getElementById('start-button');
const playAgainButton = document.getElementById('play-again-button');
const popup = document.getElementById('popup');
const winnerText = document.getElementById('winner');
const currentPlayerText = document.getElementById('current-player');
const playerInput = document.getElementById('player-input');
const game = document.getElementById('game');

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', createBoard);
playAgainButton.addEventListener('click', playAgain);

function startGame() {
    player1Name = document.getElementById('player1').value;
    player2Name = document.getElementById('player2').value;

    if (player1Name && player2Name) {
        playerInput.style.display = 'none';
        game.style.display = 'block';
        currentPlayerText.textContent = `${player1Name}'un Sırası (Pink)`;
        createBoard();
    } else {
        alert('Please enter names for both players.');
    }
}

function createBoard() {
    gameBoard.innerHTML = '';
    board = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
            row.push('');
        }
        board.push(row);
    }
    currentPlayer = 'red';
    updateCurrentPlayerText();
}

function handleCellClick(event) {
    const col = parseInt(event.target.dataset.col);
    for (let r = rows - 1; r >= 0; r--) {
        if (!board[r][col]) {
            board[r][col] = currentPlayer;
            const cell = gameBoard.querySelector(`.cell[data-row="${r}"][data-col="${col}"]`);
            cell.classList.add(currentPlayer);
            if (checkWin(r, col)) {
                showPopup();
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                updateCurrentPlayerText();
            }
            break;
        }
    }
}

function checkWin(row, col) {
    return (
        checkDirection(row, col, -1, 0) || // vertical
        checkDirection(row, col, 0, -1) || // horizontal
        checkDirection(row, col, -1, -1) || // diagonal /
        checkDirection(row, col, -1, 1) // diagonal \
    );
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 0;
    let r = row;
    let c = col;
    for (let i = 0; i < 4; i++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            if (count === 4) return true;
            r += rowDir;
            c += colDir;
        } else {
            break;
        }
    }
    r = row - rowDir;
    c = col - colDir;
    for (let i = 0; i < 4; i++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            if (count === 4) return true;
            r -= rowDir;
            c -= colDir;
        } else {
            break;
        }
    }
    return false;
}

function showPopup() {
    winnerText.textContent = `${currentPlayer === 'red' ? player1Name : player2Name} wins!`;
    popup.style.display = 'block';
}

function playAgain() {
    popup.style.display = 'none';
    createBoard();
}

function updateCurrentPlayerText() {
    currentPlayerText.textContent = `${currentPlayer === 'red' ? player1Name : player2Name}'un sırası (${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)})`;
}
