import { useSelector } from "react-redux";
import { CardsReducerState } from "./reducers/state";

export default function MainDeck() {

    const gameState = useSelector((state: CardsReducerState) => state);

    return (
      <div className='main-deck'>
        <div className="points">
          <div>{gameState.opponent.cardLayoutLabel}</div>
          <div>{gameState.opponent.points}</div>
        </div>
        <img src={require(`./assets/images/default.png`)} className="card"/>
        <div className="points">{gameState.player.points}</div>
      </div>
    );
}