const initialState = {
    loading: false,
    pokemons: [],
    error: ''
}

const PokemonReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'fetch_pokemons_request':
            return {
                ...state,
                loading: true
            };
        case 'fetch_pokemons_success':
            return {
                loading: false,
                pokemons: action.payload,
                error: ''
            };
        case 'fetch_pokemons_failure':
            return {
                loading: false,
                pokemons: [],
                error: action.payload
            };
        default:
            return state;
    }
}

export default PokemonReducer;