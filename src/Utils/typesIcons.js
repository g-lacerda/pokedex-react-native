import Bug from '../Images/types-icons/bug.svg';
import Dark from '../Images/types-icons/dark.svg';
import Dragon from '../Images/types-icons/dragon.svg';
import Electric from '../Images/types-icons/electric.svg';
import Fairy from '../Images/types-icons/fairy.svg';
import Fighting from '../Images/types-icons/fighting.svg';
import Fire from '../Images/types-icons/fire.svg';
import Flying from '../Images/types-icons/flying.svg';
import Ghost from '../Images/types-icons/ghost.svg';
import Grass from '../Images/types-icons/grass.svg';
import Ground from '../Images/types-icons/ground.svg';
import Ice from '../Images/types-icons/ice.svg';
import Normal from '../Images/types-icons/normal.svg';
import Poison from '../Images/types-icons/poison.svg';
import Psychic from '../Images/types-icons/psychic.svg';
import Rock from '../Images/types-icons/rock.svg';
import Steel from '../Images/types-icons/steel.svg';
import Water from '../Images/types-icons/water.svg';

const typeIcons = {
  bug: Bug,
  dark: Dark,
  dragon: Dragon,
  electric: Electric,
  fairy: Fairy,
  fighting: Fighting,
  fire: Fire,
  flying: Flying,
  ghost: Ghost,
  grass: Grass,
  ground: Ground,
  ice: Ice,
  normal: Normal,
  poison: Poison,
  psychic: Psychic,
  rock: Rock,
  steel: Steel,
  water: Water,
};

export const getTypeIcon = (type) => typeIcons[type.toLowerCase()] || null;
