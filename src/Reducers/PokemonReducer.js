const initialState = {
  all: [], // lista sem filtros
  filtered: [], // lista com filtros
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
    case 'fetch_all_success':
      return {
        ...state,
        loading: false,
        all: action.append ? [...state.all, ...action.payload] : action.payload,
      };
    case 'fetch_filtered_success':
      return {
        ...state,
        loading: false,
        filtered: action.append
          ? [...state.filtered, ...action.payload]
          : action.payload,
      };
    case 'fetch_pokemons_failure':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'clear_filtered_list':
      return {
        ...state,
        filtered: [],
      };
    default:
      return state;
  }
};

export default pokemonReducer;
