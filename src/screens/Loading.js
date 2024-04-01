import React, { Component } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

export default class Loading extends Component {
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
                    source={require('../Images/pokeball.png')}
                    style={[styles.img, { transform: [{ rotate: rotation }] }]} 
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff3333',
    },
    img: {
        width: 200,
        height: 200,
        opacity: 0.65      
    },
});
