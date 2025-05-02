import React from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

export default class LoadingSpinner extends React.Component {
  rotation = new Animated.Value(0);
  animation = null;

  componentDidMount() {
    this.startAnimation();
  }

  componentWillUnmount() {
    if (this.animation) {
      this.animation.stop();
    }
  }

  startAnimation = () => {
    this.rotation.setValue(0);
    this.animation = Animated.loop(
      Animated.timing(this.rotation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    this.animation.start();
  };

  render() {
    const spin = this.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '720deg'],
    });

    return (
      <View style={styles.container}>
        <Animated.Image
          source={require('../../Images/pokeball.png')}
          style={[styles.img, { transform: [{ rotate: spin }] }]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f95e5e',
  },
  img: {
    width: 50,
    height: 50,
    opacity: 0.65,
  },
});
