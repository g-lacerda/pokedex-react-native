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

export const fetchPokemons = (offset = 0) => async (dispatch) => {
    dispatch(fetchPokemonsRequest());
    try {
        const limit = 40;
        const maxPokemon = 1025;
        const remaining = maxPokemon - offset;
        const effectiveLimit = Math.min(limit, remaining);

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${effectiveLimit}&offset=${offset}`);
        const data = await response.json();

        if (response.ok) {

            let pokemonsDetails = [];

            for (const pokemon of data.results) {
                const detailsResponse = await fetch(pokemon.url);
                const details = await detailsResponse.json();

                const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${details.id}`);
                const speciesData = await speciesResponse.json();

                const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
                const evolutionChainData = await evolutionChainResponse.json();

                const evolutions = await processEvolutionChain(evolutionChainData);

                const typesFormatted = details.types.map(type => ({ name: capitalizeFirstLetter(type.type.name), url: type.type.url }));
                const statsFormatted = details.stats.map(stat => {
                    const statName = stat.stat.name.replace(/-\w/g, m => m[1].toUpperCase()).replace('attack', 'Attack').replace('special', 'Special ').replace('hp', 'HP').replace('defense', 'Defense').replace('speed', 'Speed');
                    return { base_stat: stat.base_stat, name: statName, url: stat.stat.url };
                });
                const abilitiesFormatted = details.abilities.map(ability => ({ name: capitalizeFirstLetter(ability.ability.name), url: ability.ability.url }));
                const eggGroupsFormatted = speciesData.egg_groups.map(eggGroup => ({ name: capitalizeFirstLetter(eggGroup.name), url: eggGroup.url }));

                const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en' && ['ruby', 'platinum', 'soulsilver'].includes(entry.version.name))?.flavor_text.replace(/POKéMON/g, 'POKÉMON') || '';

                let name = adjustName(pokemon.name);

                const types = {
                    'normal': { 'background': '#9d9a6b', 'font': '#1a1a1a' },
                    'fire': { 'background': '#f95e5e', 'font': '#eee' },
                    'water': { 'background': '#5b83ed', 'font': '#eee' },
                    'grass': { 'background': '#3ec6a8', 'font': '#eee' },
                    'flying': { 'background': '#9999ff', 'font': '#1a1a1a' },
                    'fighting': { 'background': '#80341d', 'font': '#eee' },
                    'poison': { 'background': '#953594', 'font': '#eee' },
                    'electric': { 'background': '#fcc43e', 'font': '#eee' },
                    'ground': { 'background': '#d4b25c', 'font': '#eee' },
                    'rock': { 'background': '#ffbb33', 'font': '#eee' },
                    'psychic': { 'background': '#ff4dd2', 'font': '#eee' },
                    'ice': { 'background': '#52bdc7', 'font': '#1a1a1a' },
                    'bug': { 'background': '#9cad1a', 'font': '#eee' },
                    'ghost': { 'background': '#26004d', 'font': '#eee' },
                    'steel': { 'background': '#a6a6a6', 'font': '#1a1a1a' },
                    'dragon': { 'background': '#632ef7', 'font': '#1a1a1a' },
                    'dark': { 'background': '#262626', 'font': '#eee' },
                    'fairy': { 'background': '#ff99ff', 'font': '#1a1a1a' },
                };

                let secondary_type;
                if (details.types.length > 1) {
                    secondary_type = details.types[1].type.name;
                }

                const primary_type = details.types[0].type.name;
                const primaryColors = types[primary_type];

                let secondaryColors;
                if (secondary_type) {
                    secondaryColors = types[secondary_type];
                }


                pokemonsDetails.push({
                    name,
                    id: details.id,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${details.id}.png`,
                    primary_type: typesFormatted[0]?.name || '',
                    secondary_type: typesFormatted[1]?.name || '',
                    colors: {
                        primary: primaryColors,
                        secondary: secondaryColors
                    },
                    description,
                    height: (details.height / 10).toFixed(2) + ' m',
                    weight: (details.weight / 10).toFixed(2) + ' kg',
                    types: typesFormatted,
                    stats: statsFormatted,
                    abilities: abilitiesFormatted,
                    egg_groups: eggGroupsFormatted,
                    base_experience: details.base_experience,
                    gender_rate: getGenderRatio(speciesData.gender_rate),
                    evolutions: evolutions
                });
            }

            dispatch(fetchPokemonsSuccess(pokemonsDetails));
        } else {
            throw new Error(`Erro da API: ${response.status}`);
        }
    } catch (error) {
        console.log(error.message);
        dispatch(fetchPokemonsFailure(error.message));
    }
};

const processEvolutionChain = async (evolutionChainData) => {
    const fetchPokemonIdByName = async (name) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error('Failed to fetch Pokémon ID by name:', error);
            return null;
        }
    };

    const addBaseForm = async (chain, evolutionSet) => {
        const baseFormId = await fetchPokemonIdByName(chain.species.name);
        if (baseFormId && !evolutionSet.has(baseFormId)) {
            evolutionSet.add(baseFormId);
            return {
                name: capitalizeFirstLetter(chain.species.name),
                url: chain.species.url,
                min_level: 0, // O Pokémon base não tem nível mínimo de evolução
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${baseFormId}.png`,
            };
        }
        return null;
    };

    const processChain = async (chain, evolutions = [], evolutionSet = new Set()) => {
        if (!chain) return evolutions;

        // Adiciona o Pokémon base à lista de evoluções antes de processar as evoluções subsequentes
        const baseForm = await addBaseForm(chain, evolutionSet);
        if (baseForm) {
            evolutions.push(baseForm);
        }

        for (const evolveTo of chain.evolves_to) {
            const evolutionDetailId = await fetchPokemonIdByName(evolveTo.species.name);

            if (!evolutionDetailId || evolutionSet.has(evolutionDetailId)) continue;
            evolutionSet.add(evolutionDetailId);

            const evolutionDetail = {
                name: capitalizeFirstLetter(evolveTo.species.name),
                url: evolveTo.species.url,
                min_level: evolveTo.evolution_details.length > 0 && evolveTo.evolution_details[0].min_level ? evolveTo.evolution_details[0].min_level : 0,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${evolutionDetailId}.png`,
            };
            evolutions.push(evolutionDetail);

            if (evolveTo.evolves_to.length > 0) {
                await processChain(evolveTo, evolutions, evolutionSet);
            }
        }

        return evolutions;
    };

    // Inicia o processamento da cadeia com o Pokémon base
    let evolutions = await processChain(evolutionChainData.chain);
    // Ordena as evoluções pelo min_level
    evolutions = evolutions.sort((a, b) => a.min_level - b.min_level);

    return evolutions;
};



const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const getGenderRatio = (genderRate) => {
    if (genderRate === -1) {
        return { male: 'No gender', female: 'No gender' };
    } else if (genderRate === 0) {
        return { male: 100, female: 0 };
    } else if (genderRate === 8) {
        return { male: 0, female: 100 };
    } else {
        const femalePercentage = genderRate * 12.5;
        const malePercentage = 100 - femalePercentage;
        return { male: malePercentage, female: femalePercentage };
    }
};

const adjustName = (old_name) => {
    const specialNames = {
        'nidoran-f': 'Nidoran Female',
        'nidoran-m': 'Nidoran Male',
        'mr-mime': 'Mr. Mime',
        'deoxys-normal': 'Deoxys Normal',
        'wormadam-plant': 'Wormadam Plant',
        'mime-jr': 'Mime Jr.',
        'giratina-altered': 'Giratina Altered',
        'shaymin-land': 'Shaymin Land',
        'basculin-red-striped': 'Basculin Red-Striped',
        'darmanitan-standard': 'Darmanitan Standard',
        'thundurus-incarnate': 'Thundurus Incarnate',
        'tornadus-incarnate': 'Tornadus Incarnate',
        'keldeo-ordinary': 'Keldeo Ordinary',
        'meloetta-aria': 'Meloetta Aria',
        'landorus-incarnate': 'Landorus Incarnate',
        'meowstic-male': 'Meowstic Male',
        'aegislash-shield': 'Aegislash Shield',
        'pumpkaboo-average': 'Pumpkaboo Average',
        'zygarde-50': 'Zygarde 50%',
        'gourgeist-average': 'Gourgeist Average',
        'oricorio-baile': 'Oricorio Baile',
        'lycanroc-midday': 'Lycanroc Midday',
        'wishiwashi-solo': 'Wishiwashi Solo',
        'minior-red-meteor': 'Minior Red Meteor',
        'mimikyu-disguised': 'Mimikyu Disguised',
        'toxtricity-amped': 'Toxtricity Amped',
        'mr-rime': 'Mr. Rime',
        'morpeko-full-belly': 'Morpeko Full Belly',
        'eiscue-ice': 'Eiscue Ice',
        'indeedee-male': 'Indeedee Male',
        'urshifu-single-strike': 'Urshifu Single Strike',
        'basculegion-male': 'Basculegion Male',
        'enamorus-incarnate': 'Enamorus Incarnate',
        'great-tusk': 'Great Tusk',
        'flutter-mane': 'Flutter Mane',
        'brute-bonnet': 'Brute Bonnet',
        'slither-wing': 'Slither Wing',
        'sandy-shocks': 'Sandy Shocks',
        'iron-treads': 'Iron Treads',
        'iron-hands': 'Iron Hands',
        'iron-jugulis': 'Iron Jugulis',
        'walking-wake': 'Walking Wake',
        'iron-moth': 'Iron Moth',
        'iron-thorns': 'Iron Thorns',
        'roaring-moon': 'Roaring Moon',
        'gouging-fire': 'Gouging Fire',
        'raging-bolt': 'Raging Bolt',
        'iron-crown': 'Iron Crown',
        'iron-boulder': 'Iron Boulder'
    };

    let name = specialNames[old_name] || old_name;
    return name
}