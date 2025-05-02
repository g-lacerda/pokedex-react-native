import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  capitalizeFirstLetter,
  adjustName,
  getGenderRatio,
  findFirstAppearance,
  processEvolutionChain,
  getTypeColors,
} from '../Utils/pokemonUtils';

export const fetchPokemonsRequest = () => ({
  type: 'fetch_pokemons_request',
});

export const fetchPokemonsSuccess = (
  pokemons,
  append = false,
  isFiltered = false
) => ({
  type: isFiltered ? 'fetch_filtered_success' : 'fetch_all_success',
  payload: pokemons,
  append,
});

export const fetchPokemonsFailure = (error) => ({
  type: 'fetch_pokemons_failure',
  payload: error,
});

export const fetchPokemons =
  (offset = 0, limit = 20, filters = {}, forceUnfiltered = false) =>
  async (dispatch) => {
    dispatch(fetchPokemonsRequest());

    try {
      const {
        typePrimary = '',
        typeSecondary = '',
        generation = '',
        searchQuery = '',
      } = filters;

      // 🔎 1. Busca direta por nome
      if (searchQuery.trim()) {
        try {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${searchQuery
              .trim()
              .toLowerCase()}`
          );
          if (!res.ok) throw new Error('Not found');

          const details = await res.json();
          const speciesRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${details.id}`
          );
          const species = await speciesRes.json();
          const evolutions = await processEvolutionChain(
            species.evolution_chain.url
          );
          const formattedFirstAppearance = findFirstAppearance(
            details.sprites.versions
          );

          const primaryType = details.types[0].type.name;
          const secondaryType = details.types[1]?.type.name;
          const colors = getTypeColors(primaryType, secondaryType);

          const pokemon = {
            id: details.id,
            name: adjustName(details.name),
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${details.id}.png`,
            primary_type: capitalizeFirstLetter(primaryType),
            secondary_type: secondaryType
              ? capitalizeFirstLetter(secondaryType)
              : '',
            colors,
            description:
              species.flavor_text_entries
                .find(
                  (entry) =>
                    entry.language.name === 'en' &&
                    ['ruby', 'platinum', 'soulsilver'].includes(
                      entry.version.name
                    )
                )
                ?.flavor_text.replace(/POK[eé]MON/g, 'POKÉMON') || '',
            height: `${(details.height / 10).toFixed(2)} m`,
            weight: `${(details.weight / 10).toFixed(2)} kg`,
            types: details.types.map((t) => ({
              name: capitalizeFirstLetter(t.type.name),
              url: t.type.url,
            })),
            stats: details.stats.map((stat) => ({
              base_stat: stat.base_stat,
              name: capitalizeFirstLetter(stat.stat.name.replace(/-/g, ' ')),
              url: stat.stat.url,
            })),
            abilities: details.abilities.map((a) => ({
              name: capitalizeFirstLetter(a.ability.name),
              url: a.ability.url,
            })),
            egg_groups: species.egg_groups.map((e) => ({
              name: capitalizeFirstLetter(e.name),
              url: e.url,
            })),
            base_experience: details.base_experience,
            gender_rate: getGenderRatio(species.gender_rate),
            evolutions,
            first_appearance: formattedFirstAppearance,
          };

          dispatch(fetchPokemonsSuccess([pokemon], false, true));
          return [pokemon];
        } catch (err) {
          dispatch(fetchPokemonsSuccess([], false, true));
          return [];
        }
      }

      let baseList = [];

      // 📅 2. Se tiver filtro por geração, busque todos os pokémons da geração
      if (generation) {
        const generationMap = {
          'Generation I': 1,
          'Generation II': 2,
          'Generation III': 3,
          'Generation IV': 4,
          'Generation V': 5,
          'Generation VI': 6,
          'Generation VII': 7,
          'Generation VIII': 8,
          'Generation IX': 9,
        };

        const generationNumber = generationMap[generation];

        if (!generationNumber) throw new Error('Geração inválida');

        const genRes = await fetch(
          `https://pokeapi.co/api/v2/generation/${generationNumber}`
        );
        const genData = await genRes.json();

        const generationSpecies = genData.pokemon_species
          .map((s) => {
            const id = parseInt(s.url.split('/').filter(Boolean).pop());
            return {
              id,
              url: `https://pokeapi.co/api/v2/pokemon/${id}`,
            };
          })
          .sort((a, b) => a.id - b.id); // 🧠 ordena por ID crescente

        baseList = generationSpecies;

        baseList = generationSpecies;
      }

      // 🧪 3. Caso sem geração: com tipos ou geral
      if (!generation) {
        if (typePrimary || typeSecondary) {
          const typesToFetch = [];
          if (typePrimary) typesToFetch.push(typePrimary.toLowerCase());
          if (typeSecondary && typeSecondary !== typePrimary)
            typesToFetch.push(typeSecondary.toLowerCase());

          const typeResults = await Promise.all(
            typesToFetch.map((type) =>
              fetch(`https://pokeapi.co/api/v2/type/${type}`).then((res) =>
                res.json()
              )
            )
          );

          const allTypeIds = typeResults.map((r) =>
            r.pokemon.map((p) =>
              parseInt(p.pokemon.url.split('/').filter(Boolean).pop())
            )
          );

          let filteredIds =
            allTypeIds.length > 1
              ? allTypeIds.reduce((a, b) => a.filter((id) => b.includes(id)))
              : allTypeIds[0];

          baseList = filteredIds.map((id) => ({
            url: `https://pokeapi.co/api/v2/pokemon/${id}`,
          }));
        } else {
          // 🔄 4. Sem filtros: paginar com offset/limit direto da API
          const baseRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
          );
          const baseData = await baseRes.json();
          baseList = baseData.results;
        }
      }

      // 🔍 5. Obter detalhes e aplicar filtros de tipo
      const detailsFull = await Promise.all(
        baseList.map(async (pokemon) => {
          try {
            const details = await (await fetch(pokemon.url)).json();
            const species = await (
              await fetch(
                `https://pokeapi.co/api/v2/pokemon-species/${details.id}`
              )
            ).json();
            const evolutions = await processEvolutionChain(
              species.evolution_chain.url
            );
            const formattedFirstAppearance = findFirstAppearance(
              details.sprites.versions
            );

            const primaryType = details.types[0].type.name;
            const secondaryType = details.types[1]?.type.name;
            const pokemonTypes = [
              primaryType?.toLowerCase(),
              secondaryType?.toLowerCase(),
            ];

            if (
              typePrimary &&
              typeSecondary &&
              !(
                pokemonTypes.includes(typePrimary.toLowerCase()) &&
                pokemonTypes.includes(typeSecondary.toLowerCase())
              )
            )
              return null;

            if (
              typePrimary &&
              !typeSecondary &&
              !pokemonTypes.includes(typePrimary.toLowerCase())
            )
              return null;
            if (
              typeSecondary &&
              !typePrimary &&
              !pokemonTypes.includes(typeSecondary.toLowerCase())
            )
              return null;

            const colors = getTypeColors(primaryType, secondaryType);

            return {
              id: details.id,
              name: adjustName(details.name),
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${details.id}.png`,
              primary_type: capitalizeFirstLetter(primaryType),
              secondary_type: secondaryType
                ? capitalizeFirstLetter(secondaryType)
                : '',
              colors,
              description:
                species.flavor_text_entries
                  .find(
                    (entry) =>
                      entry.language.name === 'en' &&
                      ['ruby', 'platinum', 'soulsilver'].includes(
                        entry.version.name
                      )
                  )
                  ?.flavor_text.replace(/POK[eé]MON/g, 'POKÉMON') || '',
              height: `${(details.height / 10).toFixed(2)} m`,
              weight: `${(details.weight / 10).toFixed(2)} kg`,
              types: details.types.map((t) => ({
                name: capitalizeFirstLetter(t.type.name),
                url: t.type.url,
              })),
              stats: details.stats.map((stat) => ({
                base_stat: stat.base_stat,
                name: capitalizeFirstLetter(stat.stat.name.replace(/-/g, ' ')),
                url: stat.stat.url,
              })),
              abilities: details.abilities.map((a) => ({
                name: capitalizeFirstLetter(a.ability.name),
                url: a.ability.url,
              })),
              moves: await Promise.all(
                details.moves
                  .filter((m) =>
                    m.version_group_details.some(
                      (v) => v.move_learn_method.name === 'level-up'
                    )
                  )
                  .map(async (m) => {
                    const levelDetail = m.version_group_details.find(
                      (v) => v.move_learn_method.name === 'level-up'
                    );
                    const moveDetails = await (await fetch(m.move.url)).json();

                    return {
                      name: capitalizeFirstLetter(
                        moveDetails.name.replace(/-/g, ' ')
                      ),
                      type: capitalizeFirstLetter(moveDetails.type.name),
                      category: capitalizeFirstLetter(
                        moveDetails.damage_class.name
                      ),
                      power: moveDetails.power ?? '—',
                      accuracy: moveDetails.accuracy ?? '—',
                      pp: moveDetails.pp,
                      level: levelDetail?.level_learned_at || 0,
                    };
                  })
              ).then((moves) => moves.sort((a, b) => a.level - b.level)),
              egg_groups: species.egg_groups.map((e) => ({
                name: capitalizeFirstLetter(e.name),
                url: e.url,
              })),
              base_experience: details.base_experience,
              gender_rate: getGenderRatio(species.gender_rate),
              evolutions,
              first_appearance: formattedFirstAppearance,
            };
          } catch (e) {
            return null;
          }
        })
      );

      const validDetails = detailsFull.filter(Boolean);

      // 📦 6. Paginação final (apenas se geração/tipo ativos)
      const finalResults =
        typePrimary || typeSecondary || generation
          ? validDetails.slice(offset, offset + limit)
          : validDetails;

      const isFiltered =
        !forceUnfiltered && (typePrimary || typeSecondary || generation);
      dispatch(fetchPokemonsSuccess(finalResults, offset > 0, isFiltered));
      return finalResults;
    } catch (error) {
      dispatch(fetchPokemonsFailure(error.message));
    }
  };

export const clearFilteredList = () => {
  return (dispatch) => {
    dispatch({ type: 'clear_filtered_list' });
  };
};
