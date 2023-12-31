import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardsReducerState, PlayerState } from '../store/state';

const cardArray = [
  'AC', 'AD', 'AH', 'AS',
  '2C', '2D', '2H', '2S',
  '3C', '3D', '3H', '3S',
  '4C', '4D', '4H', '4S',
  '5C', '5D', '5H', '5S',
  '6C', '6D', '6H', '6S',
  '7C', '7D', '7H', '7S',
  '8C', '8D', '8H', '8S',
  '9C', '9D', '9H', '9S',
  '10C', '10D', '10H', '10S',
  'JC', 'JD', 'JH', 'JS',
  'QC', 'QD', 'QH', 'QS',
  'KC', 'KD', 'KH', 'KS'
];

const shuffleArray = (array: string[]): string[] => {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  }
  return array;
}

let shuffledDeck = shuffleArray(cardArray);

const initialState: CardsReducerState = {
  player: {
    cards: shuffledDeck.slice(5,10),
    cardsToChange: [],
    points: 0,
    cardLayoutLabel: {
      text: '',
      color: 'green',
    }
  },
  opponent: {
    cards: shuffledDeck.slice(0,5),
    cardsToChange: [],
    points: 0,
    cardLayoutLabel: {
      text: '',
      color: 'green',
    }
  },
  gameDeck:  shuffledDeck.slice(10),
  isStartGame: false,
  isChecking: false
};

const gameReducer = createSlice({
  name: 'cardsReducer',
  initialState,
  reducers: {
    setGameDeck: (state, action: PayloadAction<string[]>) => {
      state.gameDeck = action.payload;
    },
    setOpponentState: (state, action: PayloadAction<PlayerState>) => {
      state.opponent = action.payload;
    },
    setPlayerState: (state, action: PayloadAction<PlayerState>) => {
      state.player = action.payload;
    },
    setIsStart: (state) => {
      state.isStartGame = !state.isStartGame;
    }, 
    setIsChecking: (state) => {
      state.isChecking = !state.isChecking;
    },
    setCardLayoutLabels: (state, action: PayloadAction<string[]>) => {
      state.opponent.cardLayoutLabel.text = action.payload[0];
      state.opponent.cardLayoutLabel.color = action.payload[1];
      state.player.cardLayoutLabel.text = action.payload[2];
      state.player.cardLayoutLabel.color = action.payload[3];
    },
    setPoints: (state, action: PayloadAction<number[]>) => {
      state.opponent.points += action.payload[0];
      state.player.points += action.payload[1];
    },
    setNextRoundState: (state, action: PayloadAction<number[]>) => {
      shuffledDeck = shuffleArray(cardArray);
      state.gameDeck = shuffledDeck.slice(10);
      state.opponent = Object.assign({}, initialState.opponent, {
        cards: shuffledDeck.slice(0,5),
        points: action.payload[0]
      });
      state.player = Object.assign({}, initialState.player, {
        cards: shuffledDeck.slice(5,10),
        points: action.payload[1]
      });
      state.isStartGame = true;
      state.isChecking = false;
    }
  },
});

export const { 
  setGameDeck,
  setOpponentState,
  setPlayerState,
  setIsStart,
  setIsChecking,
  setNextRoundState,
  setPoints,
  setCardLayoutLabels } = gameReducer.actions;

export default gameReducer.reducer;
