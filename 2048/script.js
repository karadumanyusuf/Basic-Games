document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    const size = 4;
    let board = Array(size * size).fill(0);
    let score = 0;

    function addRandomTile() {
        let emptyTiles = board.map((val, index) => val === 0 ? index : null).filter(val => val !== null);
        if (emptyTiles.length === 0) return;
        let randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        updateBoard();
    }

    function updateBoard() {
        tiles.forEach((tile, index) => {
            tile.textContent = board[index] !== 0 ? board[index] : '';
            tile.className = 'tile';
            if (board[index] !== 0) tile.classList.add('tile-' + board[index]);
        });
        document.getElementById('score').textContent = score;
    }

    function handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
        }
        addRandomTile();
        if (isGameOver()) {
            showGameOver();
        }
    }

    function moveLeft() {
        for (let i = 0; i < size; i++) {
            let row = board.slice(i * size, i * size + size);
            let newRow = slide(row);
            board.splice(i * size, size, ...newRow);
        }
    }

    function moveRight() {
        for (let i = 0; i < size; i++) {
            let row = board.slice(i * size, i * size + size).reverse();
            let newRow = slide(row).reverse();
            board.splice(i * size, size, ...newRow);
        }
    }

    function moveUp() {
        for (let i = 0; i < size; i++) {
            let column = [];
            for (let j = 0; j < size; j++) {
                column.push(board[i + j * size]);
            }
            let newColumn = slide(column);
            for (let j = 0; j < size; j++) {
                board[i + j * size] = newColumn[j];
            }
        }
    }

    function moveDown() {
        for (let i = 0; i < size; i++) {
            let column = [];
            for (let j = 0; j < size; j++) {
                column.push(board[i + j * size]);
            }
            let newColumn = slide(column.reverse()).reverse();
            for (let j = 0; j < size; j++) {
                board[i + j * size] = newColumn[j];
            }
        }
    }

    function slide(row) {
        row = row.filter(val => val);
        while (row.length < size) row.push(0);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row.splice(i + 1, 1);
                row.push(0);
            }
        }
        return row;
    }

    function isGameOver() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i * size + j] === 0) return false;
                if (j < size - 1 && board[i * size + j] === board[i * size + j + 1]) return false;
                if (i < size - 1 && board[i * size + j] === board[(i + 1) * size + j]) return false;
            }
        }
        return true;
    }

    function showGameOver() {
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
    }

    document.getElementById('retry-button').addEventListener('click', () => {
        board = Array(size * size).fill(0);
        score = 0;
        addRandomTile();
        addRandomTile();
        updateBoard();
        document.getElementById('game-over').classList.add('hidden');
    });

    addRandomTile();
    addRandomTile();
    updateBoard();
    document.addEventListener('keydown', handleKeyPress);
});
