import { useSelector } from "react-redux";
import { CardsReducerState } from "./reducers/state";

export default function MainDeck() {

    const gameState = useSelector((state: CardsReducerState) => state);

    return (
      <div className='main-deck'>
        <div 
          className="info-label" 
          style={{color: gameState.opponent.cardLayoutLabel.color}}>
          {gameState.opponent.cardLayoutLabel.text}</div>
        <div>
          <div className="points">{gameState.opponent.points}</div>
          <img src={require(`./assets/images/default.png`)} className="card"/>
          <div className="points">{gameState.player.points}</div>
        </div>
        <div 
          className="info-label" 
          style={{color: gameState.player.cardLayoutLabel.color}}>
          {gameState.player.cardLayoutLabel.text}</div>
      </div>
    );
}