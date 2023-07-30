import './styles/App.css';
import './styles/Deck.css';
import './styles/Card.css';
import OpponentDeck from './components/OpponentDeck';
import { useSelector } from 'react-redux';
import { CardsReducerState } from './store/state';
import PlayerDeck from './components/PlayerDeck';
import MainDeck from './components/MainDeck';
import Menu from './components/Menu';

export default function App() {

  const gameState = useSelector((state: CardsReducerState) => state);

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

