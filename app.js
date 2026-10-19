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

const movesDisplay = document.querySelector("#moves");
const status = document.querySelector("#status");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const deck = shuffle([...fruits, ...fruits]);



function buildBoard() {
    const board = document.querySelector("#board");
    
    board.innerHTML = "";
    
    deck.forEach((fruit, i) => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");

        card.setAttribute("aria-label", `Card ${i + 1}, face down`);

        card.dataset.index = i;

        board.appendChild(card);
    });
}

buildBoard();



const flippedCards = [];

const board = document.querySelector("#board");

board.addEventListener("click", (event) => {
    const card = event.target;

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

        const firstFruit = deck[Number(flippedCards[0].dataset.index)];
        const secondFruit = deck[Number(flippedCards[1].dataset.index)];

        if (firstFruit.name === secondFruit.name) {
            flippedCards[0].classList.add("matched");
            flippedCards[1].classList.add("matched");

            flippedCards[0].disabled = true;
            flippedCards[1].disabled = true;

                status.textContent = "That's a pair!";

            flippedCards.length = 0;
        }
    }

});



