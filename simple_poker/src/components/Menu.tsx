import { useDispatch, useSelector } from "react-redux";
import { CardsReducerState } from "../store/state";
import { setNextRoundState, setIsChecking, setIsStart, setOpponentState, setPlayerState, setPoints, setCardLayoutLabels } from "../reducers/gameReducer";
import { useState, useEffect } from "react";

type Card = string;
type Hand = Card[];

const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardSuits = ['C', 'D', 'H', 'S'];

const handRanks = [
  'Royal flush',
  'Straight flush',
  'Four of a kind',
  'Full house',
  'Flush',
  'Straight',
  'Three of a kind',
  'Two pair',
  'One pair',
  'High card',
];

export default function Menu() {

  const [changeCardsClicked, setChangeCardsClicked] = useState<boolean>(false);
  const dispatch = useDispatch();
  const gameState = useSelector((state: CardsReducerState) => state);

  useEffect(() => {
    if(gameState.isChecking) {
      verifyWinner();
    }
  }, [gameState.isChecking])

  const verifyWinner = () => {

    const opponentCards: Hand = Object.assign(gameState.opponent.cards);
    const playerCards: Hand = Object.assign(gameState.player.cards);

    const cardValue = (card: Card) => cardValues.indexOf(card.slice(0, -1));
    const cardSuit = (card: Card) => card.slice(-1);
    const sortHand = (hand: Hand) => [...hand].sort((a, b) => cardValue(a) - cardValue(b));

    const isFlush = (hand: Hand) => new Set(hand.map(cardSuit)).size === 1;
    const isStraight = (hand: Hand) => hand.every((card, i, hand) => i === 0 || cardValue(card) === cardValue(hand[i - 1]) + 1);
    const countCards = (hand: Hand) => hand.reduce((counts: Record<number, number>, card) => { counts[cardValue(card)] = (counts[cardValue(card)] || 0) + 1; return counts; }, {} as Record<number, number>);

    const rankHand = (hand: Hand) => {
      const sorted = sortHand(hand);
      const counts = countCards(sorted);
      const pairs = Object.values(counts).filter(count => count === 2).length;
      const threes = Object.values(counts).filter(count => count === 3).length;
    
      if (isFlush(sorted)) {
        if (isStraight(sorted) && cardValue(sorted[0]) === cardValues.indexOf('10')) return 'Royal flush';
        if (isStraight(sorted)) return 'Straight flush';
        return 'Flush';
      }
    
      if (Object.values(counts).includes(4)) return 'Four of a kind';
      if (pairs === 1 && threes === 1) return 'Full house';
      if (isStraight(sorted)) return 'Straight';
      if (threes === 1) return 'Three of a kind';
      if (pairs === 2) return 'Two pair';
      if (pairs === 1) return 'One pair';
      return 'High card';
    };

    const updateStateAfterVerify = (points: number[], labels: string[]) => {
      dispatch(setPoints(points));
      dispatch(setCardLayoutLabels(
        [labels[0],
         points[0] >= points[1] ? 'green' : 'red',
          labels[1],
          points[1] >= points[0] ? 'green' : 'red']));
    }

    const opponentRank = rankHand(opponentCards);
    const playerRank = rankHand(playerCards);

    const verifyLogic = () => {
      if (handRanks.indexOf(opponentRank) < handRanks.indexOf(playerRank)) {
        updateStateAfterVerify([1,0], [opponentRank, playerRank]);
        return;
      } else if (handRanks.indexOf(opponentRank) > handRanks.indexOf(playerRank)) {
        updateStateAfterVerify([0,1], [opponentRank, playerRank]);
        return;
      } else {
        const sortedOpponentCards = sortHand(opponentCards);
        const sortedPlayerCards = sortHand(playerCards);
        for (let i = sortedOpponentCards.length - 1; i >= 0; i--) {
          const opponentHighCard = cardValue(sortedOpponentCards[i]);
          const playerHighCard = cardValue(sortedPlayerCards[i]);
          if (opponentHighCard > playerHighCard) {
            updateStateAfterVerify([1,0], [opponentRank, playerRank]);
            return;
          } else if (opponentHighCard < playerHighCard) {
            updateStateAfterVerify([0,1], [opponentRank, playerRank]);
            return;
          }
        }
        updateStateAfterVerify([0,0], [opponentRank, playerRank]);
        return;
      }
    } 
    
    verifyLogic();
  };

  const newGameClick = () => {
    dispatch(setIsStart());
  }

  const getCardsForExchangeByOpponent = (): string[] => {

    const count = Math.floor(Math.random() * 6);

    const selectRandomCards = (count: number): string[] => {
    
        const copyCards = [...gameState.opponent.cards];
        let selectedCards: string[] = [];
    
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * copyCards.length);
            selectedCards.push(copyCards[randomIndex]);
            copyCards.splice(randomIndex, 1);
        }
    
        return selectedCards;
    };

    const cards = selectRandomCards(count)
    dispatch(setOpponentState({...gameState.opponent, cardsToChange: cards}));
    return cards;
  }

  const exchangeCardsLogic = (opCardsForExchange: string[], isPlayerExchanging = true) => {
    const exchangeCards = (cardsForExchange: string[], cards: string[], deck: string[], dispatchFn: Function) => {
      const cardsForChangeIndexes: number[] = cards.map((card, i) => cardsForExchange.includes(card) ? i : -1).filter(index => index !== -1);
  
      const incomingCards: string[] = deck.slice(0, cardsForChangeIndexes.length);
      const copyCards = [...cards];
  
      cardsForChangeIndexes.forEach((cardIndex, i) => {
        copyCards[cardIndex] = incomingCards[i];
      });
  
      const newDeck = deck.slice(cardsForChangeIndexes.length);
      dispatchFn(copyCards);
      return newDeck;
    };
  
    let deck: string[] = gameState.gameDeck;
  
    // Exchange opponent's cards
    deck = exchangeCards(opCardsForExchange, gameState.opponent.cards, deck, (newOpCards: string[]) => {
      dispatch(setOpponentState({ ...gameState.opponent, cards: newOpCards }));
    });
  
    if(!isPlayerExchanging) return;
  
    // Exchange player's cards
    deck = exchangeCards(gameState.player.cardsToChange, gameState.player.cards, deck, (newPlCards: string[]) => {
      dispatch(setPlayerState({ ...gameState.player, cards: newPlCards }));
    });
  };
  

  const exchangeCards = () => {

    setChangeCardsClicked(true);
    const opCardsForExchange = getCardsForExchangeByOpponent();

    // wymiana wybranych kart
    setTimeout(() => {
      exchangeCardsLogic(opCardsForExchange);
    }, 500);
  }

  const checkCards = () => {

    if(!changeCardsClicked) {
      setChangeCardsClicked(true);
      const opCardsForExchange = getCardsForExchangeByOpponent();

      // bez tego nie zaznaczają się karty przeciwnika po wymianie
      setTimeout(() => {
        exchangeCardsLogic(opCardsForExchange, false);
      }, 3);
    }
    dispatch(setIsChecking());
  }

  const nextRoundClick = () => {
    dispatch(setNextRoundState([gameState.opponent.points, gameState.player.points]));
    setChangeCardsClicked(false);
  }

  return (
    <div className="menu">
        <button className="main-button next-button" onClick={nextRoundClick} hidden={!gameState.isChecking}>Next</button>
        <button className="main-button" onClick={newGameClick} disabled={gameState.isStartGame}>NewGame</button>
        <button className="main-button" onClick={exchangeCards} disabled={!gameState.isStartGame || changeCardsClicked}>Change Cards</button>
        <button className="main-button" onClick={checkCards} disabled={!gameState.isStartGame || gameState.isChecking}>Check Cards</button>
    </div>
  );
}

