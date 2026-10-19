
const fruits = [
    { name: "apple", symbol: "🍎 " },
    { name: "banana", symbol: "🍌 " },
    { name: "cherry", symbol: "🍒 " },
    { name: "coconut", symbol: "🥥 " },
    { name: "grapes", symbol: "🍇 " },
    { name: "mango", symbol: "🥭 " },
    { name: "pineapple", symbol: "🍍 " },
    { name: "watermelon", symbol: "🍉 " },
];

let moves = 0;
let waiting = false;
let flipTimer = null;
let deck = [];

const movesDisplay = document.querySelector("#moves");
const status = document.querySelector("#status");
const board = document.querySelector("#board");
const newGameButton = document.querySelector("#new-game");

const flippedCards = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function buildBoard() {
    board.replaceChildren();

    deck.forEach((fruit, i) => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;

        board.appendChild(card);
    });
}

function startNewGame() {
    if (flipTimer !== null) {
        clearTimeout(flipTimer);
        flipTimer = null;
    }

    waiting = false;
    flippedCards.length = 0;

    moves = 0;
    movesDisplay.textContent = moves;

    status.textContent =
        "Turn over two cards to find a matching pair.";

    status.classList.remove("you-won");

    
    deck = shuffle([...fruits, ...fruits]);
    buildBoard();
}
startNewGame();

board.addEventListener("click", (event) => {
    const card = event.target;

    if (waiting) {
        return;
    }

    if (!card.classList.contains("card")) {
        return;
    }

    if (card.classList.contains("flipped")) {
        return;
    }

    const fruit = deck[Number(card.dataset.index)];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");

    card.setAttribute(
        "aria-label",
        `Card ${Number(card.dataset.index) + 1}, ${fruit.name}`
    );

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;

        const firstFruit =
            deck[Number(flippedCards[0].dataset.index)];

        const secondFruit =
            deck[Number(flippedCards[1].dataset.index)];

        if (firstFruit.name === secondFruit.name) {
            // The cards match
            flippedCards[0].classList.add("matched");
            flippedCards[1].classList.add("matched");

            flippedCards[0].disabled = true;
            flippedCards[1].disabled = true;

            status.textContent = "That's a pair!";

            flippedCards.length = 0;

            // Check whether all 16 cards are matched
            const matchedCards =
                document.querySelectorAll("#board .matched");

            if (matchedCards.length === 16) {
                status.textContent =
                    `You found all the pairs in ${moves} moves!`;

                status.classList.add("you-won");
            }
        } else {
            // The cards do not match
            status.textContent = "Not a pair. Try again.";

            waiting = true;

            flipTimer = setTimeout(() => {
                flippedCards.forEach((flippedCard) => {
                    const index =
                        Number(flippedCard.dataset.index);

                    flippedCard.textContent = "";
                    flippedCard.classList.remove("flipped");

                    flippedCard.setAttribute(
                        "aria-label",
                        `Card ${index + 1}, face down`
                    );
                });

                flippedCards.length = 0;
                waiting = false;
                flipTimer = null;
            }, 1000);
        }
    }
});

newGameButton.addEventListener("click", startNewGame);
