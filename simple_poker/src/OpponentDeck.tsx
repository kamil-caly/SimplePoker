import { useSelector } from "react-redux";
import Card from "./Card";
import { CardsReducerState } from "./reducers/state";
import { useState } from "react";

type OpponentDeckProps = {

}

export default function OpponentDeck(props: OpponentDeckProps) {

    const [isCheck, setIsCheck] = useState<boolean>(false);
    const gameState = useSelector((state: CardsReducerState) => state);

    console.log("opponent state: ", gameState.opponent);

    return (
        <div className="opponent-deck">
          {gameState.opponent.cards.map((card, index) => (
            <Card id={index}
              cardName={card}
              isPlayerCard={false}
              hiden={!gameState.isChecking}     
            />
          ))}
        </div>
      );
}