import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";

import { connect } from 'react-redux';


export class Pokemon extends Component {

    render() {

        const { pokemons } = this.props;

        const renderPokemons = ({ item }) => (
            <View style={{ height: 75 }}>
                <Text style={styles.atendimentoTexto}>{item.name}</Text>
            </View>
        );

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

const PokemonConnect = connect(mapStateToProps)(Pokemon);

export default PokemonConnect;

