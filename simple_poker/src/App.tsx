import './styles/App.css';
import './styles/Deck.css';
import './styles/Card.css';
import OpponentDeck from './OpponentDeck';
import { useDispatch, useSelector } from 'react-redux';
import { CardsReducerState } from './reducers/state';
import { setGameDeck } from './reducers/gameReducer';
import PlayerDeck from './PlayerDeck';
import MainDeck from './MainDeck';
import { useState } from 'react';
import Menu from './Menu';

export default function App() {

  const dispatch = useDispatch();

  const gameState = useSelector((state: CardsReducerState) => state);
  console.log("gameState: ", gameState);

  return (
    <div className='App'>
      <MainDeck/>
      <div className='middle-view'>
        <OpponentDeck/>
        <PlayerDeck/>
      </div>
      <Menu/>
    </div>
  );
}

