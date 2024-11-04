let selectedCardValue = null;

  
function selectCard(card) {
  // Remove 'selected' class from all card-value elements
  const cardValues = document.querySelectorAll('.card-value');
  cardValues.forEach(cardValue => cardValue.classList.remove('selected'));

  // Add 'selected' class to the clicked card-value element
  card.classList.add('selected');
  selectedCardValue = card.textContent;
}

// Function to create a deck of cards
function createDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value: value, suit: suit });
    }
  }
  return deck;
}

// Function to shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Function to deal cards
function dealCards(deck, cardValue) {
const dealerCards = [];
const userCards = [];
let winner = null;
let dealerGotCard = false;

for (let i = 0; i < deck.length; i += 2) {
  const dealerCard = deck[i];
  const userCard = deck[i + 1];

  dealerCards.push(dealerCard);
  if (dealerCard.value === cardValue) {
    dealerGotCard = true;
    winner = 'Dealer';
    break;
  }
  userCards.push(userCard);
  if (userCard.value === cardValue) {
    winner = 'User';
    break;
  }
}

return { dealerCards, userCards, winner, dealerGotCard };
}
// Existing JavaScript code

// Function to display cards with animation
// Function to display cards with animation alternately
function displayCardsWithAnimation(dealerCards, userCards, dealerContainerId, userContainerId, winningCardValue, callback) {
const dealerContainer = document.getElementById(dealerContainerId);
const userContainer = document.getElementById(userContainerId);
dealerContainer.innerHTML = '';
userContainer.innerHTML = '';

const maxCards = Math.max(dealerCards.length, userCards.length);

// Function to display a single card
const displayCard = (card, container, isDealer) => {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  const cardImage = document.createElement('img');
  cardImage.src = `cardImages/${card.value.toLowerCase()}_of_${card.suit.toLowerCase()}.png`;
  cardImage.alt = `${card.value} of ${card.suit}`;


  cardContainer.appendChild(cardImage);
  container.appendChild(cardContainer);

  // Highlight the winner's container when the winning card is displayed
  if (card.value === winningCardValue) {
    container.parentElement.classList.add('winner-container');
  }
};

// Alternately display cards to dealer and user
for (let i = 0; i < maxCards; i++) {
  setTimeout(() => {
    if (i < dealerCards.length) {
      displayCard(dealerCards[i], dealerContainer, true);
    }
    setTimeout(() => {
      if (i < userCards.length) {
        displayCard(userCards[i], userContainer, false);
      }

      // Execute callback after the last card is displayed
      if (i === maxCards - 1 && callback) {
        callback();
      }
    }, 500); // Delay each user's card by 800 milliseconds (adjust as needed)
  }, i * 1000); // Delay each dealer's card by 1600 milliseconds (adjust as needed)
}
}



let initialBet = null;
let initialCard = null;



// Main function to start the game
function startGame() {
if (!gameReset) {
  alert('Please reset the game before starting a new one.');
  return;
}

if (!selectedCardValue) {
  alert('Please select a card value.');
  return;
}

const amountInput = document.getElementById('amount');
const amount = parseFloat(amountInput.value);
if (isNaN(amount) || amount <= 0) {
  alert('Please enter a valid amount.');
  return;
}

// Store the initially selected bet and card
initialBet = amount;
initialCard = selectedCardValue;

// Set gameReset to false
gameReset = false;

const deck = createDeck();
shuffleDeck(deck);
const { dealerCards, userCards, winner, dealerGotCard } = dealCards(deck, selectedCardValue);

// Display cards with animation alternately
displayCardsWithAnimation(dealerCards, userCards, 'dealer-cards', 'user-cards', selectedCardValue, () => {
  document.getElementById('result').textContent = `Winner: ${winner}`;
});

// Calculate odds and display preview
calculateOdds();
}



// Function to reset the game and start again with the initially selected bet and card, allowing for a new card selection
function playAgain() {
if (!initialBet) {
  alert('Please start a new game first.');
  return;
}

// Clear the result and the winner's container highlight
const result = document.getElementById('result');
result.textContent = '';
const dealerContainer = document.querySelector('.dealer');
const userContainer = document.querySelector('.user');
dealerContainer.classList.remove('winner-container');
userContainer.classList.remove('winner-container');

// Clear displayed cards
document.getElementById('dealer-cards').innerHTML = '';
document.getElementById('user-cards').innerHTML = '';

// If a new card is selected, update initialCard
const selectedCard = document.querySelector('.card-value.selected');
if (selectedCard) {
  initialCard = selectedCard.textContent;
}

// Reset the selected card highlight
const cardValues = document.querySelectorAll('.card-value');
cardValues.forEach(cardValue => cardValue.classList.remove('selected'));

// Highlight the selected card again
const newSelectedCard = document.querySelector(`.card-value[data-value="${initialCard}"]`);
if (newSelectedCard) {
  newSelectedCard.classList.add('selected');
}

// Reset the amount input and preview
document.getElementById('amount').value = initialBet.toString();
calculateOdds();

// Set selectedCardValue to initialCard
selectedCardValue = initialCard;

// Reset the game and start a new game with the initially selected bet and card
gameReset = true;
startGame();
}




// Function to calculate odds and display preview
function calculateOdds() {
const amountInput = document.getElementById('amount');
const amount = parseFloat(amountInput.value);
if (isNaN(amount) || amount <= 0) {
  document.getElementById('preview').textContent = 'Invalid amount';
  return;
}
const odds = 1.7 * amount;
const roundedOdds = odds.toFixed(1);
document.getElementById('preview').textContent = `Odds : 1.7   -   Payout: ${roundedOdds}`; // Added text for potential winnings
}



// Event listener for input change
document.getElementById('amount').addEventListener('input', calculateOdds);


// Function to display cards
function displayCards(cards, containerId) {
const container = document.getElementById(containerId);
container.innerHTML = '';
cards.forEach(card => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.textContent = `${card.value} of ${card.suit}`;
  
  // Check if the card is a heart or diamond and apply red color
  if (card.suit === 'Hearts' || card.suit === 'Diamonds') {
    cardElement.style.color = 'red';
  }

  container.appendChild(cardElement);
});
}


// Variable to track if the game has been reset
let gameReset = true;

// Function to reset the game
function resetGame() {
// Clear selected card
const cardValues = document.querySelectorAll('.card-value');
cardValues.forEach(cardValue => cardValue.classList.remove('selected'));
selectedCardValue = null;

// Clear amount input and preview
document.getElementById('amount').value = '';
document.getElementById('preview').textContent = '';

// Clear result
const result = document.getElementById('result');
result.textContent = '';

// Remove highlighted border from winner's container
const dealerContainer = document.querySelector('.dealer');
const userContainer = document.querySelector('.user');
dealerContainer.classList.remove('winner-container');
userContainer.classList.remove('winner-container');

// Clear displayed cards
document.getElementById('dealer-cards').innerHTML = '';
document.getElementById('user-cards').innerHTML = '';

// Set gameReset to true
gameReset = true;
}