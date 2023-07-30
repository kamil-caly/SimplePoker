import { createStore } from "redux";
import cardsReducer from '../reducers/gameReducer'; // Twój główny reducer

const store = createStore(cardsReducer);

export default store;