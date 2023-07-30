export type CardsReducerState = {
    opponent: PlayerState,
    gameDeck: string[],
    player: PlayerState,
    isStartGame: boolean,
    isChecking: boolean,
}

export type PlayerState = {
    cards: string[],
    points: number,
    cardsToChange: string[],
    cardLayoutLabel: string
}