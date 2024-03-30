import { combineReducers } from "redux";
import PokemonReducer from './Reducers/PokemonReducer';

const Reducers = combineReducers({

    pokemon: PokemonReducer

});

export default Reducers;