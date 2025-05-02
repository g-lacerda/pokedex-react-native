import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import ProgressBar from './Components/ProgressBar';
import Divider from './Components/Divider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTypeIcon } from '../Utils/typesIcons';
import { getTypeColors } from '../Utils/pokemonUtils';

const Pokemon = ({ pokemons, route, navigation }) => {
  const [activeTab, setActiveTab] = useState('About');
  const rotation = useRef(new Animated.Value(1)).current;

  const pokemonId = route.params?.pokemonId;
  const pokemon = pokemons.find((p) => p.id === pokemonId);

  useEffect(() => {
    const animate = () => {
      rotation.setValue(0);
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(animate, 200);
      });
    };
    animate();
  }, [rotation]);

  const interpolateRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {['About', 'Base Stats', 'Evolution', 'Moves'].map((tab) => (
        <Text
          key={tab}
          style={[
            styles.tabText,
            activeTab === tab && {
              ...styles.activeTab,
              borderBottomColor: getTypeColors(
                pokemon.primary_type.toLowerCase()
              )?.primary.background,
            },
          ]}
          onPress={() => setActiveTab(tab)}
        >
          {tab}
        </Text>
      ))}
    </View>
  );

  const renderMoves = () => (
    <View>
      <Text style={styles.moduleLabel}>Moves by Level</Text>
      {pokemon.moves.length === 0 ? (
        <Text style={styles.contentText}>No moves found.</Text>
      ) : (
        pokemon.moves.map((move, index) => {
          const IconComponent = getTypeIcon(move.type);
          const colors = getTypeColors(move.type.toLowerCase())?.primary || {
            background: '#ccc',
          };

          return (
            <View key={`${move.name}-${index}`} style={styles.moveItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.moveName}>
                    Lv. {move.level} – {move.name}
                  </Text>
                  <Text style={styles.moveDetails}>Type: {move.type}</Text>
                  <Text style={styles.moveDetails}>
                    Category: {move.category}
                  </Text>
                  <Text style={styles.moveDetails}>Power: {move.power}</Text>
                  <Text style={styles.moveDetails}>
                    Accuracy: {move.accuracy}
                  </Text>
                  <Text style={styles.moveDetails}>PP: {move.pp}</Text>
                </View>

                {IconComponent && (
                  <View
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 20,
                      width: 32,
                      height: 32,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}
                  >
                    <IconComponent width={20} height={20} />
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}
      <View style={{ paddingBottom: 20 }} />
    </View>
  );

  const renderContent = () => {
    if (!pokemon) return <Text>Pokémon não encontrado.</Text>;
    const description = pokemon.description?.replace(/POKéMON/g, 'POKÉMON');

    switch (activeTab) {
      case 'About':
        return (
          <View style={styles.tabContentContainer}>
            <Text style={styles.moduleLabel}>Description</Text>
            <Text style={styles.descriptionTitleText}>{description}</Text>
            <Text style={styles.moduleLabel}>Breeding</Text>
            <View style={styles.genderRateContainer}>
              <Text style={styles.infoModuleLabel}>Gender: </Text>
              <View style={styles.genderProgressContainer}>
                <Ionicons name="male" color="#2a45f7" size={25} />
                <Text style={styles.valueText}>
                  {pokemon.gender_rate.male}%
                </Text>
              </View>
              <View style={styles.genderProgressContainer}>
                <Ionicons name="female" color="#f72af7" size={25} />
                <Text style={styles.valueText}>
                  {pokemon.gender_rate.female}%
                </Text>
              </View>
            </View>
            <View style={styles.genderRateContainer}>
              <Text style={styles.infoModuleLabel}>Egg Groups: </Text>
              <Text style={styles.statLabel}>
                {pokemon.egg_groups.map((e) => e.name).join(', ')}
              </Text>
            </View>
          </View>
        );
      case 'Base Stats':
        return (
          <View style={styles.tabContentContainer}>
            <Text style={styles.moduleLabel}>Stats</Text>
            {pokemon.stats.map((stat) => (
              <View key={stat.name} style={styles.statContainer}>
                <Text style={styles.statLabel}>{capitalize(stat.name)}:</Text>
                <Text style={styles.valueText}>{stat.base_stat}</Text>
                <View style={styles.progressBarContainer}>
                  <ProgressBar
                    progress={(stat.base_stat / 255) * 100}
                    progressColor={pokemon.colors.primary.background}
                    backgroundColor="#a6a6a6"
                  />
                </View>
                <Divider width={50} marginVertical={15} />
              </View>
            ))}
          </View>
        );
      case 'Evolution':
        return (
          <View style={styles.tabContentContainer}>
            {pokemon.evolutions.map((evo, index) => (
              <View
                key={index}
                style={{ alignItems: 'center', marginBottom: 20 }}
              >
                {index > 0 && (
                  <Ionicons name="arrow-down" color="#000" size={40} />
                )}
                <Text style={styles.descriptionText}>{evo.name}</Text>
                <Text style={styles.descriptionText}>
                  Level{' '}
                  {evo.min_level === undefined || evo.min_level === 0
                    ? '1'
                    : evo.min_level}
                </Text>
                <Image
                  source={{ uri: evo.image }}
                  style={styles.evolutionsImages}
                />
              </View>
            ))}
          </View>
        );
      case 'Moves':
        return renderMoves();
      default:
        return <Text style={styles.contentText}>Select a tab</Text>;
    }
  };

  if (!pokemon) return <Text>Pokémon não encontrado.</Text>;

  return (
    <View
      style={{ backgroundColor: pokemon.colors.primary.background, flex: 1 }}
    >
      <View
        style={{
          backgroundColor: pokemon.colors.primary.background,
          height: 250,
        }}
      >
        <View style={styles.textAndTypeContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" color="#eee" size={40} />
          </TouchableOpacity>
          <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
          <View style={styles.typesContainer}>
            <Text style={styles.typeStyle}>
              {capitalize(pokemon.primary_type)}
            </Text>
            {pokemon.secondary_type && (
              <Text style={styles.typeStyle}>
                {capitalize(pokemon.secondary_type)}
              </Text>
            )}
          </View>
        </View>
        <Animated.Image
          source={require('../Images/pokeball.png')}
          style={[
            styles.backgroundImg,
            { transform: [{ rotate: interpolateRotation }] },
          ]}
        />
        <Image source={{ uri: pokemon.image }} style={styles.img} />
      </View>

      <View
        style={[
          styles.containerScrollView,
          { backgroundColor: pokemon.colors.primary.background },
        ]}
      >
        {renderTabs()}
        <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  moveItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  moveName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moveDetails: {
    fontSize: 14,
    color: '#666',
  },

  contentText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#141414',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  containerScrollView: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: 'hidden',
    flex: 1,
  },
  scrollView: {
    padding: 20,
    backgroundColor: '#eee',
    flex: 1,
  },
  descriptionTitleText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#141414',
    marginBottom: 50,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#141414',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  statLabelContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#4f4f4f',
    fontWeight: 'bold',
    flex: 1,
    paddingTop: 3.5,
  },
  genderRateContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  genderProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  genderLabel: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 18,
    color: '#383838',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  progressBarContainer: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  img: {
    position: 'absolute',
    width: 225,
    height: 225,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  evolutionsImages: {
    width: 200,
    height: 200,
  },
  backgroundImg: {
    position: 'absolute',
    width: 200,
    height: 200,
    right: -25,
    top: -35,
    zIndex: 0,
    opacity: 0.25,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#eee',
    alignSelf: 'flex-start',
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeStyle: {
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'rgba(288,288,288, 0.2)',
    color: '#eee',
    fontSize: 20,
  },
  textAndTypeContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 15,
    marginTop: 10,
    zIndex: 2,
  },
  moduleLabel: {
    fontSize: 24,
    color: '#141414',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  infoModuleLabel: {
    fontSize: 18,
    color: '#383838',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabText: {
    padding: 10,
    fontWeight: 'bold',
    color: 'grey',
  },
  activeTab: {
    color: 'black',
    borderBottomWidth: 2,
  },
  backButton: {
    paddingBottom: 15,
  },
  tabContentContainer: {
    marginBottom: 20,
  },
});
const mapStateToProps = (state) => ({
  pokemons:
    state.pokemon.filtered.length > 0
      ? state.pokemon.filtered
      : state.pokemon.all,
});

export default connect(mapStateToProps)(Pokemon);
