export const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const adjustName = (name) => {
  const specialNames = {
    // Gerações anteriores
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
    'morpeko-full-belly': 'Morpeko',
    'eiscue-ice': 'Eiscue Ice',
    'indeedee-male': 'Indeedee Male',
    'urshifu-single-strike': 'Urshifu Single Strike',
    'basculegion-male': 'Basculegion Male',
    'enamorus-incarnate': 'Enamorus Incarnate',

    // Geração 9: Paradoxos e formas especiais
    'great-tusk': 'Great Tusk',
    'flutter-mane': 'Flutter Mane',
    'brute-bonnet': 'Brute Bonnet',
    'slither-wing': 'Slither Wing',
    'sandy-shocks': 'Sandy Shocks',
    'iron-treads': 'Iron Treads',
    'iron-bundle': 'Iron Bundle',
    'iron-hands': 'Iron Hands',
    'iron-jugulis': 'Iron Jugulis',
    'iron-moth': 'Iron Moth',
    'iron-thorns': 'Iron Thorns',
    'roaring-moon': 'Roaring Moon',
    'walking-wake': 'Walking Wake',
    'iron-leaves': 'Iron Leaves',
    'gouging-fire': 'Gouging Fire',
    'raging-bolt': 'Raging Bolt',
    'iron-boulder': 'Iron Boulder',
    'iron-crown': 'Iron Crown',
    'maushold-family-of-four': 'Maushold',
    'squawkabilly-green-plumage': 'Squawkabilly',
    'dudunsparce-two-segment': 'Dudunsparce',
    'scream-tail': 'Scream Tail',
    'tatsugiri-curly': 'Tatsugiri',
    'palafin-zero': 'Palafin',
    'oinkologne-male': 'Oinkologne',
  };

  return specialNames[name] || name;
};

export const getGenderRatio = (rate) => {
  if (rate === -1) return { male: 'No gender', female: 'No gender' };
  const female = rate * 12.5;
  return { male: 100 - female, female };
};

export const getTypeColors = (primary, secondary) => {
  const palette = {
    fire: '#f95e5e',
    water: '#5b83ed',
    grass: '#3ec6a8',
    electric: '#fcc43e',
    psychic: '#ff4dd2',
    ice: '#52bdc7',
    dragon: '#632ef7',
    dark: '#262626',
    fairy: '#ff99ff',
    normal: '#9d9a6b',
    flying: '#9999ff',
    bug: '#9cad1a',
    poison: '#953594',
    rock: '#ffbb33',
    ground: '#d4b25c',
    ghost: '#26004d',
    steel: '#a6a6a6',
    fighting: '#80341d',
  };
  return {
    primary: { background: palette[primary] || '#888', font: '#eee' },
    secondary: secondary
      ? { background: palette[secondary] || '#888', font: '#eee' }
      : undefined,
  };
};

export const findFirstAppearance = (versions) => {
  for (const gen of Object.keys(versions).sort()) {
    for (const ver in versions[gen]) {
      const sprites = versions[gen][ver];
      if (
        Object.values(sprites).some(
          (s) => s && (typeof s === 'string' || Object.values(s).some(Boolean))
        )
      ) {
        return `Generation ${gen.replace('generation-', '').toUpperCase()}`;
      }
    }
  }
  return 'Unknown';
};

export const processEvolutionChain = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  const evolutions = [];
  const seen = new Set();

  const fetchDetails = async (speciesUrl) => {
    const resp = await fetch(
      speciesUrl.replace('/pokemon-species', '/pokemon')
    );
    const poke = await resp.json();
    return {
      id: poke.id,
      name: capitalizeFirstLetter(poke.name),
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${poke.id}.png`,
    };
  };

  const walkChain = async (chain, fromLevel = 1) => {
    const current = await fetchDetails(chain.species.url);

    if (!seen.has(current.id)) {
      seen.add(current.id);
      evolutions.push({ ...current, min_level: fromLevel });
    }

    for (const next of chain.evolves_to) {
      const nextMon = await fetchDetails(next.species.url);
      const evolutionDetails = next.evolution_details[0];

      const nextLevel = evolutionDetails?.min_level ?? 1;

      if (!seen.has(nextMon.id)) {
        seen.add(nextMon.id);
        evolutions.push({
          ...nextMon,
          min_level: nextLevel,
        });
      }

      await walkChain(next, nextLevel);
    }
  };

  await walkChain(data.chain);
  return evolutions;
};
