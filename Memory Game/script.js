// script.js
document.addEventListener('DOMContentLoaded', () => {
    const shapes = ['circle', 'triangle', 'square', 'star', 'diamond', 'hexagon', 'oval', 'parallelogram'];
    const cards = [...shapes, ...shapes]; // 8 çift farklı şekil
    const gameContainer = document.querySelector('.game-container');

    // Kartları rastgele sıraya koy
    shuffle(cards);

    // Kartları oluştur ve konteynıra ekle
    cards.forEach(shape => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-shape', shape);
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });

    let flippedCards = [];
    let matchedCards = 0;
    const totalPairs = cards.length / 2;
    let currentPlayer = 1;
    const scores = [0, 0];

    function flipCard(event) {
        const clickedCard = event.currentTarget;
        if (flippedCards.length === 2 || clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched')) {
            return;
        }

        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }

    function checkMatch() {
        const [firstCard, secondCard] = flippedCards;

        if (firstCard.dataset.shape === secondCard.dataset.shape) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            scores[currentPlayer - 1]++;
            updateScores();
            matchedCards++;
            if (matchedCards === totalPairs) {
                showWinner();
            }
        } else {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }

        flippedCards = [];
    }

    function updateScores() {
        document.getElementById('player1-score').textContent = scores[0];
        document.getElementById('player2-score').textContent = scores[1];
    }

    function showWinner() {
        const winnerMessage = scores[0] > scores[1] ? '1. Oyuncu Kazandı!' : '2. Oyuncu Kazandı!';
        document.getElementById('winner-message').textContent = winnerMessage;
        document.getElementById('final-scores').textContent = `1. Oyuncu: ${scores[0]} - 2. Oyuncu: ${scores[1]}`;
        document.getElementById('winner-popup').classList.remove('hidden');
    }

    document.getElementById('play-again-button').addEventListener('click', () => {
        location.reload();
    });

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
