// Global Variables
let playerName = "";
let playerMoney = 0;
let playerBet = 0;
let playerScore = 0;
let dealerScore = 0;
let deck = [];

// Start game
function startGame() {
  playerName = document.getElementById("player-name").value;
  playerMoney = parseInt(document.getElementById("initial-money").value);
  document.getElementById("display-name").innerText = playerName;
  document.getElementById("money").innerText = playerMoney;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  // Reset the deck and scores
  resetDeck();
  resetRound();
}

// Reset the round
function resetRound() {
  playerScore = 0;
  dealerScore = 0;
  document.getElementById("player-cards").innerHTML = "";
  document.getElementById("dealer-cards").innerHTML = "";
  document.getElementById("player-score").innerText = "0";
  document.getElementById("dealer-score").innerText = "0";
  document.getElementById("result-message").innerText = "";

  // Reset the central message container
  const animationDiv = document.getElementById("animation");
  animationDiv.classList.add("hidden");
  animationDiv.innerText = "";
}

// Create and shuffle the deck
function resetDeck() {
  deck = [];
  const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
  const values = [1, 2, 3, 4, 5, 6, 7, "J", "Q", "K"];
  suits.forEach(suit => {
    values.forEach(value => {
      let cardValue = (typeof value === "number") ? value : 0.5;
      deck.push({ suit, value, cardValue });
    });
  });
  deck = deck.sort(() => Math.random() - 0.5);
}

// Start a new round
function startNewRound() {
  resetRound(); // Reset the round to clear previous messages and scores
  let bet = prompt("How much do you want to bet?");
  playerBet = parseInt(bet);
  if (isNaN(playerBet) || playerBet <= 0 || playerBet > playerMoney) {
    alert("Invalid bet.");
    return;
  }

  playerMoney -= playerBet;
  document.getElementById("money").innerText = playerMoney;
  document.getElementById("round-section").style.display = "block";

  // Show Ask Card and Stand buttons
  document.querySelector("button[onclick='drawPlayerCard()']").style.display = "inline";
  document.querySelector("button[onclick='stand()']").style.display = "inline";

  // Hide the result message when starting a new round
  document.getElementById("result-message").style.display = "none";

  drawPlayerCard();
}

// Create card element
function createCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  // Create inner card container for flip effect
  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  // Create the back of the card
  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");
  cardBack.innerText = "🂠"; // You can use a symbol or text for the back

  // Create the front of the card
  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");
  let suitSymbol = '';

  switch (card.suit) {
    case "Hearts":
      suitSymbol = '♥';
      break;
    case "Diamonds":
      suitSymbol = '♦';
      break;
    case "Spades":
      suitSymbol = '♠';
      break;
    case "Clubs":
      suitSymbol = '♣';
      break;
  }
  cardFront.innerHTML = `
    <div class="card-value">${card.value}</div>
    <div class="card-suit">${suitSymbol}</div>
  `;

  // Assemble the parts of the card
  cardInner.appendChild(cardBack);  // Show the back first
  cardInner.appendChild(cardFront);  // Front appears after the flip
  cardElement.appendChild(cardInner);

  // Apply flip effect to show the front after a brief delay
  setTimeout(() => {
    cardElement.classList.add("flip");
  }, 100); // This delay determines when the card flips

  return cardElement;
}

// Draw card
function drawPlayerCard() {
  if (deck.length === 0) resetDeck();
  const card = deck.pop();
  playerScore += card.cardValue;
  document.getElementById("player-score").innerText = playerScore.toFixed(1);
  document.getElementById("player-cards").appendChild(createCardElement(card));

  // If the player exceeds 7.5 points, the round ends automatically
  if (playerScore > 7.5) {
    endRound(`You have exceeded! You lose ${playerBet}$ against the bank.`, false);
    hideActionButtons();
  }
}

// Stand and dealer's turn
function stand() {
  hideActionButtons();

  while (dealerScore < playerScore && dealerScore <= 7.5) {
    if (deck.length === 0) resetDeck();
    const card = deck.pop();
    dealerScore += card.cardValue;
    document.getElementById("dealer-cards").appendChild(createCardElement(card));
  }
  document.getElementById("dealer-score").innerText = dealerScore.toFixed(1);

  if (dealerScore > 7.5 || dealerScore < playerScore) {
    const winnings = playerBet * 2;
    playerMoney += winnings;
    endRound(`You Win ${winnings}$!`, true);
  } else {
    endRound(`You Lose ${playerBet}$ against the bank.`, false);
  }
}

// End the round with animation
function endRound(message, isWin) {
  document.getElementById("result-message").innerText = message;
  document.getElementById("result-message").style.display = "block"; // Show message at the end of the round
  document.getElementById("money").innerText = playerMoney;

  const animationDiv = document.getElementById("animation");
  animationDiv.classList.remove("hidden");

  if (isWin) {
    animationDiv.classList.add("win-animation");
    animationDiv.innerText = `🎉 You Win ${playerBet * 2}$! 🎉`;
  } else {
    animationDiv.classList.add("lose-animation");
    animationDiv.innerText = `💥 You Lose ${playerBet}$ 💥`;
  }

  // Hide and clear the animation after 3 seconds
  setTimeout(() => {
    animationDiv.classList.add("hidden");                 // Hide the div
    animationDiv.classList.remove("win-animation", "lose-animation"); // Remove animation classes
    animationDiv.innerText = "";                          // Clear the text and emojis
  }, 3000);
}

// Hide action buttons
function hideActionButtons() {
  document.querySelector("button[onclick='drawPlayerCard()']").style.display = "none";
  document.querySelector("button[onclick='stand()']").style.display = "none";
}

// End the game
function endGame() {
  alert(`You receive $ ${playerMoney}. See you next time!`);

  document.getElementById("game-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("player-name").value = "";
  document.getElementById("initial-money").value = "";

  // Hide the result message and reset game variables
  document.getElementById("result-message").style.display = "none";

  playerName = "";
  playerMoney = 0;
  playerBet = 0;
  playerScore = 0;
  dealerScore = 0;
  deck = [];
}
