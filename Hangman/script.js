const categories = {
    'plants-fruits-vegetables': [
        "apple", "banana", "orange", "grape", "strawberry", "watermelon", "cherry", "peach", "blueberry", "pineapple",
        "mango", "kiwi", "lemon", "lime", "apricot", "plum", "coconut", "pomegranate", "raspberry", "blackberry",
        "avocado", "fig", "grapefruit", "guava", "papaya", "pear", "tangerine", "cantaloupe", "honeydew", "nectarine",
        "passionfruit", "persimmon", "rose", "tulip", "daisy", "sunflower", "fern", "bamboo", "maple", "oak", "pine",
        "lettuce", "spinach", "carrot", "potato", "tomato", "onion", "garlic", "cucumber", "pepper", "broccoli"
    ],
    'objects': [
        "chair", "table", "lamp", "sofa", "bed", "mirror", "door", "window", "clock", "shelf", "pencil", "book", "phone",
        "computer", "keyboard", "mouse", "screen", "backpack", "umbrella", "bottle", "cup", "plate", "spoon", "fork",
        "knife", "toothbrush", "towel", "soap", "shampoo", "toilet", "shower", "bathtub", "drawer", "cabinet", "stove",
        "oven", "microwave", "fridge", "freezer", "blender", "toaster", "mixer", "vacuum", "iron", "fan", "heater"
    ],
    'animals': [
        "dog", "cat", "elephant", "tiger", "lion", "giraffe", "zebra", "horse", "cow", "sheep", "goat", "pig", "chicken",
        "duck", "goose", "turkey", "rabbit", "mouse", "rat", "squirrel", "monkey", "gorilla", "kangaroo", "panda",
        "koala", "penguin", "seal", "whale", "dolphin", "shark", "octopus", "crab", "lobster", "starfish", "jellyfish",
        "ant", "bee", "butterfly", "moth", "spider", "worm", "snail", "snake", "lizard", "frog", "turtle", "bird",
        "eagle", "parrot", "peacock"
    ],
    'space': [
        "sun", "moon", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "asteroid", "comet", "galaxy",
        "nebula", "star", "planet", "meteor", "blackhole", "supernova", "cosmos", "universe", "astronaut", "spaceship",
        "telescope", "observatory", "satellite", "rocket", "gravity", "orbit", "eclipse", "crater", "radiation",
        "constellation", "quasar", "pulsar", "asterism", "cosmonaut", "launch", "module", "spacewalk", "solarsystem",
        "lightyear", "exoplanet", "interstellar", "hubble", "spacestation", "rover", "probe", "meteorite"
    ]
};

let selectedWord = '';
let guessedLetters = [];
let attempts = 6;

const wordElement = document.getElementById('word');
const messageElement = document.getElementById('message');
const letterButtonsContainer = document.querySelector('.letter-buttons');
const restartButton = document.getElementById('restart-btn');
const canvas = document.getElementById('hangman-canvas');
const context = canvas.getContext('2d');
const categorySelection = document.getElementById('category-selection');

function initGame(category) {
    const words = categories[category];
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    attempts = 6;
    wordElement.innerHTML = selectedWord.split('').map(letter => '_').join(' ');
    messageElement.textContent = '';
    context.clearRect(0, 0, canvas.width, canvas.height);
    generateLetterButtons();
    canvas.style.display = 'block';
    wordElement.style.display = 'block';
    letterButtonsContainer.style.display = 'flex';
    restartButton.style.display = 'block';
    categorySelection.style.display = 'none';
}

function generateLetterButtons() {
    letterButtonsContainer.innerHTML = '';
    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(65 + i);
        const button = document.createElement('button');
        button.textContent = letter;
        button.addEventListener('click', () => handleLetterClick(letter));
        letterButtonsContainer.appendChild(button);
    }
}

function handleLetterClick(letter) {
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    if (selectedWord.toUpperCase().includes(letter)) {
        updateWordDisplay();
    } else {
        attempts--;
        drawHangman();
        if (attempts === 0) {
            messageElement.textContent = 'Game Over! The word was ' + selectedWord;
            disableAllButtons();
        }
    }

    if (!wordElement.textContent.includes('_')) {
        messageElement.textContent = 'You Win!';
        disableAllButtons();
    }
}

function updateWordDisplay() {
    const wordArray = selectedWord.split('').map(letter => guessedLetters.includes(letter.toUpperCase()) ? letter : '_');
    wordElement.textContent = wordArray.join(' ');
}

function disableAllButtons() {
    const buttons = document.querySelectorAll('.letter-buttons button');
    buttons.forEach(button => button.disabled = true);
}

function drawHangman() {
    switch (attempts) {
        case 5:
            context.beginPath();
            context.moveTo(10, 190);
            context.lineTo(190, 190);
            context.stroke();
            break;
        case 4:
            context.moveTo(50, 190);
            context.lineTo(50, 10);
            context.stroke();
            break;
        case 3:
            context.moveTo(50, 10);
            context.lineTo(150, 10);
            context.stroke();
            break;
        case 2:
            context.moveTo(150, 10);
            context.lineTo(150, 40);
            context.stroke();
            break;
        case 1:
            context.beginPath();
            context.arc(150, 50, 10, 0, Math.PI * 2);
            context.stroke();
            break;
        case 0:
            context.moveTo(150, 60);
            context.lineTo(150, 120);
            context.stroke();
            context.moveTo(150, 80);
            context.lineTo(130, 100);
            context.stroke();
            context.moveTo(150, 80);
            context.lineTo(170, 100);
            context.stroke();
            context.moveTo(150, 120);
            context.lineTo(130, 150);
            context.stroke();
            context.moveTo(150, 120);
            context.lineTo(170, 150);
            context.stroke();
            break;
    }
}

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        initGame(category);
    });
});

restartButton.addEventListener('click', () => {
    canvas.style.display = 'none';
    wordElement.style.display = 'none';
    letterButtonsContainer.style.display = 'none';
    restartButton.style.display = 'none';
    categorySelection.style.display = 'block';
    messageElement.textContent = '';
});

initGame();
