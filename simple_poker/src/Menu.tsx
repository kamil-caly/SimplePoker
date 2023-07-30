import { useDispatch, useSelector } from "react-redux";
import { CardsReducerState } from "./reducers/state";
import { setNextRoundState, setIsChecking, setIsStart, setOpponentState, setPlayerState, setPoints, setCardLayoutLabels } from "./reducers/gameReducer";
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
      dispatch(setCardLayoutLabels(labels));
    }

    const opponentRank = rankHand(opponentCards);
    const playerRank = rankHand(playerCards);
  
    if (handRanks.indexOf(opponentRank) < handRanks.indexOf(playerRank)) {
      updateStateAfterVerify([1,0], [opponentRank, playerRank]);
      return;
    } else if (handRanks.indexOf(opponentRank) > handRanks.indexOf(playerRank)) {
      updateStateAfterVerify([0,1], [opponentRank, playerRank]);
      return;
    } else {
      const opponentHighCard = Math.max(...opponentCards.map(cardValue));
      const playerHighCard = Math.max(...playerCards.map(cardValue));
      if (opponentHighCard > playerHighCard) {
        updateStateAfterVerify([1,0], [opponentRank, playerRank]);
        return;
      } else if (opponentHighCard < playerHighCard) {
        updateStateAfterVerify([0,1], [opponentRank, playerRank]);
        return;
      } else {
        updateStateAfterVerify([0,0], [opponentRank, playerRank]);
        return;
      }
    }
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
    const deck: string[] = gameState.gameDeck;
    const opCardsForChangeIndexes: number[] = [];
    for(let i = 0; i < 5; i ++) {
      if(opCardsForExchange.includes(gameState.opponent.cards[i])) {
        opCardsForChangeIndexes.push(i);
      }
    }

    let incomingOpCards: string[] = deck.slice(0, opCardsForChangeIndexes.length);
    let copyOpCards = [...gameState.opponent.cards];
    let i = 0;

    opCardsForChangeIndexes.forEach(c => {
      copyOpCards[c] = incomingOpCards[i];
      i++;
    })
    const newOpCards = copyOpCards;
    dispatch(setOpponentState({...gameState.opponent, cards: newOpCards}));

    if(!isPlayerExchanging)
      return;

    const plCardsForChangeIndexes: number[] = [];
    for(let i = 0; i < 5; i ++) {
      if(gameState.player.cardsToChange.includes(gameState.player.cards[i])) {
        plCardsForChangeIndexes.push(i);
      }
    }

    let incomingPlCards: string[] = deck.slice(opCardsForChangeIndexes.length, opCardsForChangeIndexes.length + plCardsForChangeIndexes.length);
    let copyPlCards = [...gameState.player.cards];
    i = 0;

    plCardsForChangeIndexes.forEach(c => {
      copyPlCards[c] = incomingPlCards[i];
      i++;
    })
    const newPlCards = copyPlCards;

    dispatch(setPlayerState({...gameState.player, cards: newPlCards}));
  }

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
        <button className="main-button" onClick={() => newGameClick()} disabled={gameState.isStartGame}>NewGame</button>
        <button className="main-button" onClick={() => exchangeCards()} disabled={!gameState.isStartGame || changeCardsClicked}>Change Cards</button>
        <button className="main-button" onClick={() => checkCards()} disabled={!gameState.isStartGame || gameState.isChecking}>Check Cards</button>
    </div>
  );
}

