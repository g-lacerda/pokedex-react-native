import React, { Component } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

export default class LoadingSpinner extends Component {
    rotation = new Animated.Value(0);

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        this.rotation.setValue(0);
        Animated.timing(this.rotation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(this.animate, 800);
        });
    };

    render() {
        const rotation = this.rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '720deg'],
        });

        return (
            <View style={styles.container}>
                <Animated.Image
                    source={require('../../Images/pokeball.png')}
                    style={[styles.img, { transform: [{ rotate: rotation }] }]} 
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
        backgroundColor: '#f95e5e'
    },
    img: {
        width: 50, 
        height: 50,
        opacity: 0.65      
    },
});
