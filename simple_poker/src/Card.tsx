import { useEffect, useRef, useState } from "react";
import { deckOfCards } from "./DeckOfCards";
import { useDispatch, useSelector } from "react-redux";
import { CardsReducerState } from "./reducers/state";
import { setPlayerState } from "./reducers/gameReducer";

type CardProps = {
    id: number
    cardName: string,
    hiden: boolean,
    isPlayerCard: boolean,
}

export default function Card(props: CardProps) {
    const cardPng = deckOfCards[props.cardName as keyof typeof deckOfCards];
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const dispatch = useDispatch();

    const gameState = useSelector((state: CardsReducerState) => state);

    useEffect(() => {
        // "opponent change something in state"
        if(gameState.opponent.cardsToChange.includes(gameState.opponent.cards[props.id]) && !props.isPlayerCard) {
            setIsSelected(true);
        }
    }, [gameState.opponent.cardsToChange])

    useEffect(() => {
        setIsSelected(false);
    }, [gameState.gameDeck])

    const selectCard = () => {
        let newPlayerState;
        if(isSelected) {
            newPlayerState = {
                ...gameState.player, 
                cardsToChange: gameState.player.cardsToChange.filter(card => card !== props.cardName)
            }
        } else {
            let newCards = [...gameState.player.cardsToChange, props.cardName];
            newPlayerState = {
                ...gameState.player, 
                cardsToChange: newCards
            }
        }

        dispatch(setPlayerState(newPlayerState));
        setIsSelected(prevState => !prevState);
    }

    return (
        <>
            <img src={require(`./assets/images/${props.hiden ? 'default.png' : cardPng}`)} 
            key={props.id}
            id={props.id.toString()}
            alt={cardPng.split('.')[0]} 
            className={`card ${isSelected ? (props.isPlayerCard ? 'card-selected' : 'card-opponent-selected') : ''}`} 
            onClick={(e) => props.isPlayerCard && gameState.isStartGame && selectCard()}
            />
        </>
      );
}