import React from 'react';
import { View, StyleSheet } from 'react-native';


const Divider = ({width = 40, marginVertical = 30}) => {
    const dividerStyle = {
        height: 1,
        backgroundColor: '#d3d3d3',
        width: `${width}%`, 
        marginVertical: marginVertical, 
    };

    return (
        <View style={styles.container}>
            <View style={dividerStyle} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default Divider;
