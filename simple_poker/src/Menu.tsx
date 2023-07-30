import { useDispatch, useSelector } from "react-redux";
import { CardsReducerState } from "./reducers/state";
import { setInitialState, setIsChecking, setIsStart, setOpponentState, setPlayerState } from "./reducers/gameReducer";
import { useState, useEffect } from "react";

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
    
  }

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
    dispatch(setInitialState());
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

