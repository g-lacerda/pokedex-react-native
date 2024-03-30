import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

import { connect } from 'react-redux';


export class Home extends Component {

    render() {

        const { pokemons } = this.props;

        const renderPokemons = ({ item }) => {
            const imageName = `https://img.pokemondb.net/artwork/large/${item.name.toLowerCase()}.jpg`;
            console.log('oi');
            return (
                <View style={{ height: 75 }}>
                    <Image source={{ uri: imageName }} style={styles.img} />
                    <Text style={styles.atendimentoTexto}>{item.name}</Text>
                </View>
            );
        };
        

        return (
            <View>
                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => item.key}
                    scrollEnabled={true}
                    renderItem={renderPokemons}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pokemons: state.pokemon.pokemons
    };
};

const styles = StyleSheet.create({
    atendimentoTexto: {
        textAlign: 'center',
        fontSize: 18,
        paddingBottom: 20,
        paddingTop: 20,
        color: '#000',
        fontWeight: 'bold'
    },
});

const HomeConnect = connect(mapStateToProps)(Home);

export default HomeConnect;

