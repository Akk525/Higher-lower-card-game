export async function getRandomCard() {
  try {
    console.log("Fetching a random card...");
    
    // Use a CORS proxy to avoid CORS issues
    const corsProxy = "https://corsproxy.io/?";
    const deckApiUrl = `https://qrandom.io/api/random/deck?cards=10`;
    const proxiedDeckUrl = `${corsProxy}${encodeURIComponent(deckApiUrl)}`;
    
    console.log(`Calling deck API through proxy at: ${proxiedDeckUrl}`);
    
    const deckResponse = await fetch(proxiedDeckUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-cache",
    });
    
    if (!deckResponse.ok) {
      const errorText = await deckResponse.text();
      console.error(`Deck API error (${deckResponse.status}):`, errorText);
      
      // Fall back to local card generation if API fails
      return generateLocalCard();
    }
    
    const deckData = await deckResponse.json();
    console.log("Deck API response received");
    
    // Check if we have cards in the response
    if (deckData && deckData.deck && Array.isArray(deckData.deck.cards) && deckData.deck.cards.length > 0) {
      // Instead of making another API call for a random index,
      // just select a random card from the deck we already have
      const randomIndex = Math.floor(Math.random() * deckData.deck.cards.length);
      const selectedCard = deckData.deck.cards[randomIndex];
      
      console.log(`Selected card: ${selectedCard.rank} of ${selectedCard.suit}`);
      
      return {
        suit: selectedCard.suit.toLowerCase(),
        rank: formatCardRank(selectedCard.rank),
        code: `${formatCardRank(selectedCard.rank)[0].toUpperCase()}${selectedCard.suit[0].toUpperCase()}`,
        image: null,
        value: convertToNumericValue(selectedCard.rank),
      };
    } else {
      console.error("Invalid deck data received:", deckData);
      return generateLocalCard();
    }
  } catch (error) {
    console.error("Error fetching random card:", error);
    return generateLocalCard();
  }
}

// Generate a card locally as fallback
function generateLocalCard() {
  console.log("Generating a local card as fallback");
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['ace', 'king', 'queen', 'jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  
  return {
    suit: suit.toLowerCase(),
    rank: formatCardRank(rank),
    code: `${formatCardRank(rank)[0].toUpperCase()}${suit[0].toUpperCase()}`,
    image: null,
    value: convertToNumericValue(rank),
  };
}

// Format card rank for display
function formatCardRank(rank) {
  if (!rank) return "";
  const lowerRank = rank.toString().toLowerCase();
  const rankMap = { ace: "A", king: "K", queen: "Q", jack: "J" };
  return rankMap[lowerRank] || rank;
}

// Convert card rank to numeric value for comparison
function convertToNumericValue(value) {
  if (!value) return 0;

  const valueMap = {
    ACE: 14, A: 14, ace: 14,
    KING: 13, K: 13, king: 13,
    QUEEN: 12, Q: 12, queen: 12,
    JACK: 11, J: 11, jack: 11,
    "10": 10, "9": 9, "8": 8, "7": 7,
    "6": 6, "5": 5, "4": 4, "3": 3, "2": 2,
  };

  return valueMap[value.toString().toLowerCase()] || parseInt(value) || 0;
}