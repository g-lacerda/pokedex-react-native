import React, { Component } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { connect } from 'react-redux';
import { fetchPokemons } from '../Actions/FetchPokemon';
import { getShuffledPokemonFacts } from '../Utils/pokemonFacts';

class Loading extends Component {
  state = {
    rotation: new Animated.Value(0),
    factIndex: 0,
    pokemonFacts: getShuffledPokemonFacts(),
  };

  componentDidMount() {
    this.animate();
    this.loadInitialPokemons();
    this.factInterval = setInterval(this.rotateFacts, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.factInterval);
  }

  loadInitialPokemons = async () => {
    await this.props.fetchPokemons(0, 20, {}, false);
    this.props.navigation.navigate('Home');
  };

  rotateFacts = () => {
    this.setState((prevState) => ({
      factIndex: (prevState.factIndex + 1) % prevState.pokemonFacts.length,
    }));
  };

  animate = () => {
    this.state.rotation.setValue(0);
    Animated.timing(this.state.rotation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => setTimeout(this.animate, 800));
  };

  render() {
    const { rotation, factIndex, pokemonFacts } = this.state;
    const spin = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '720deg'],
    });

    return (
      <View style={styles.container}>
        <View style={styles.spaceContainer} />
        <View style={styles.imageContainer}>
          <Animated.Image
            source={require('../Images/pokeball.png')}
            style={[styles.img, { transform: [{ rotate: spin }] }]}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>We are preparing your Pokédex!</Text>
          <Text style={styles.textFunFact}>
            Meanwhile, read some fun facts about Pokémon!
          </Text>
          <Text style={styles.funFact}>{pokemonFacts[factIndex]}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spaceContainer: { flex: 0.8 },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f95e5e',
    paddingTop: 30,
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  img: {
    width: 200,
    height: 200,
    opacity: 0.65,
  },
  text: {
    textAlign: 'center',
    color: '#eee',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textFunFact: {
    textAlign: 'center',
    color: '#eee',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
  },
  funFact: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#eee',
    fontSize: 26,
    marginHorizontal: 15,
  },
});

const mapDispatchToProps = {
  fetchPokemons,
};

export default connect(null, mapDispatchToProps)(Loading);
