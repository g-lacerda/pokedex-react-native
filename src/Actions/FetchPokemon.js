export const fetchPokemonsRequest = () => ({
    type: 'fetch_pokemons_request'
});

export const fetchPokemonsSuccess = (pokemons) => ({
    type: 'fetch_pokemons_success',
    payload: pokemons
});

export const fetchPokemonsFailure = (error) => ({
    type: 'fetch_pokemons_failure',
    payload: error
});

export const fetchPokemons = () => async (dispatch) => {
    dispatch(fetchPokemonsRequest());
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000');
        const data = await response.json();

        if (response.ok) {
            dispatch(fetchPokemonsSuccess(data.results));
        } else {
            throw new Error(`Erro da API: ${response.status}`);
        }
    } catch (error) {
        dispatch(fetchPokemonsFailure(error.message));
    }
};
