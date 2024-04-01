const initialState = {
    pokemons: [],
    loading: false,
    error: null,
};

const pokemonReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'fetch_pokemons_request':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'fetch_pokemons_success':
            return {
                ...state,
                loading: false,
                pokemons: [...state.pokemons, ...action.payload],
            };
        case 'fetch_pokemons_failure':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default pokemonReducer;
