const grid = document.getElementById('sudoku-grid');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const closePopup = document.getElementsByClassName('close')[0];

const solutions = {
    easy: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    medium: [
        [0, 2, 0, 6, 0, 8, 0, 0, 0],
        [5, 8, 0, 0, 0, 9, 7, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 0],
        [3, 7, 0, 0, 0, 0, 5, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 8, 0, 0, 0, 0, 1, 3],
        [0, 0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 9, 8, 0, 0, 0, 3, 6],
        [0, 0, 0, 3, 0, 6, 0, 9, 0]
    ],
    hard: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 4, 3, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 6],
        [0, 0, 0, 5, 0, 9, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 1, 8],
        [0, 0, 0, 0, 8, 1, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 5, 0],
        [0, 4, 0, 0, 0, 0, 3, 0, 0]
    ]
};

// Shuffle array elements
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate a valid Sudoku grid
function generateGrid(solution) {
    const grid = solution.map(row => [...row]);

    // Randomly shuffle rows and columns within each 3x3 block
    for (let i = 0; i < 9; i += 3) {
        shuffle(grid.slice(i, i + 3));
        for (let j = 0; j < 9; j++) {
            const column = grid.map(row => row[j]);
            shuffle(column.slice(i, i + 3));
            for (let k = 0; k < 3; k++) {
                grid[i + k][j] = column[i + k];
            }
        }
    }

    return grid;
}

function createGrid(solution) {
    grid.innerHTML = ''; // Clear previous grid
    const generatedGrid = generateGrid(solution);

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('input');
            cell.type = 'number';
            cell.min = 1;
            cell.max = 9;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.value = generatedGrid[row][col] !== 0 ? generatedGrid[row][col] : '';
            grid.appendChild(cell);
        }
    }
}

// Difficulty selection
document.getElementById('easy').addEventListener('click', () => createGrid(solutions.easy));
document.getElementById('medium').addEventListener('click', () => createGrid(solutions.medium));
document.getElementById('hard').addEventListener('click', () => createGrid(solutions.hard));

// Check solution function
document.getElementById('check-solution').addEventListener('click', () => {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    let isCorrect = true;

    inputs.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const value = parseInt(cell.value) || 0;
        if (solutions.easy[row][col] !== value && solutions.medium[row][col] !== value && solutions.hard[row][col] !== value) {
            isCorrect = false;
            cell.style.backgroundColor = 'salmon'; // Mark incorrect cells
        } else {
            cell.style.backgroundColor = 'white'; // Mark correct cells
        }
    });

    if (isCorrect) {
        popupMessage.textContent = 'Tebrikler! Çözüm doğru!';
    } else {
        popupMessage.textContent = 'Çözüm yanlış, lütfen tekrar deneyin.';
    }

    popup.style.display = 'block';
});

// Close pop-up function
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == popup) {
        popup.style.display = 'none';
    }
});
