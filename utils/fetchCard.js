export async function getRandomCard() {
    try {
      console.log("Fetching a random card...");
  
      // Step 1: Fetch a shuffled deck of cards
      const deckApiUrl = `https://qrandom.io/api/random/deck?decks=1`;
      console.log(`Calling deck API at: ${deckApiUrl}`);
  
      const deckResponse = await fetch(deckApiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-cache",
      });
  
      if (!deckResponse.ok) {
        const errorText = await deckResponse.text();
        console.error(`Deck API error (${deckResponse.status}):`, errorText);
        throw new Error(`Deck API returned status: ${deckResponse.status}`);
      }
  
      const deckData = await deckResponse.json();
      console.log("Deck API response:", deckData);
  
      // ✅ Ensure the response has a valid deck
      if (!deckData.deck || !Array.isArray(deckData.deck.cards) || deckData.deck.cards.length === 0) {
        console.error("Invalid deck response structure:", deckData);
        throw new Error("Deck API returned invalid data structure");
      }
  
      const actualDeckSize = deckData.deck.cards.length;
      console.log(`Received deck with ${actualDeckSize} cards`);
  
      // Step 2: Get a random number to select a card from the deck
      const randomApiUrl = `https://qrandom.io/api/random/int?min=0&max=${actualDeckSize - 1}`;
      console.log(`Calling random number API at: ${randomApiUrl}`);
  
      const randomResponse = await fetch(randomApiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-cache",
      });
  
      if (!randomResponse.ok) {
        const errorText = await randomResponse.text();
        console.error(`Random number API error (${randomResponse.status}):`, errorText);
        throw new Error(`Random number API returned status: ${randomResponse.status}`);
      }
  
      const randomData = await randomResponse.json();
      console.log("Random number API response:", randomData);
  
      // ✅ Ensure the random number is valid
      const randomIndex = Math.floor(randomData.number ?? 0);
      console.log(`Selected card index: ${randomIndex} from deck of ${actualDeckSize}`);
  
      if (randomIndex < 0 || randomIndex >= actualDeckSize) {
        throw new Error(`Random index ${randomIndex} is out of range`);
      }
  
      // Step 3: Get the selected card
      const selectedCard = deckData.deck.cards[randomIndex];
      console.log("Selected card:", selectedCard);
  
      if (!selectedCard.suit || !selectedCard.rank) {
        throw new Error("Selected card is missing suit or rank");
      }
  
      console.log(`Card selected: ${selectedCard.rank} of ${selectedCard.suit}`);
  
      // ✅ Return the card in the correct format
      return {
        suit: selectedCard.suit.toLowerCase(),
        rank: formatCardRank(selectedCard.rank),
        code: `${formatCardRank(selectedCard.rank)[0].toUpperCase()}${selectedCard.suit[0].toUpperCase()}`,
        image: null, // Add an image lookup function if needed
        value: convertToNumericValue(selectedCard.rank),
      };
    } catch (error) {
      console.error("Error fetching random card:", error);
      return null; // Return null instead of throwing to prevent crashes
    }
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
  
    return valueMap[value] || parseInt(value, 10) || 0;
  }