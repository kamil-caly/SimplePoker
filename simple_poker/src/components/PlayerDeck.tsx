import { useSelector } from "react-redux";
import Card from "./Card";
import { CardsReducerState } from "../store/state";

type OpponentDeckProps = {

}

export default function PlayerDeck(props: OpponentDeckProps) {

    const gameState = useSelector((state: CardsReducerState) => state);

    return (
      <>
        <div className="player-deck">
          {gameState.player.cards.map((card, index) => (
            <Card id={index} 
            isPlayerCard={true} 
            cardName={card} 
            hiden={!gameState.isStartGame}
            />
          ))}
        </div>
      </>
    );
}