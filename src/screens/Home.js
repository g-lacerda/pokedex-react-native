import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';
import { fetchPokemons } from '../Actions/FetchPokemon';
import LoadingSpinner from './Components/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';


const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export class Home extends Component {

    state = {
        offset: 0,
        loading: false
    };

    componentDidMount() {
        this.props.fetchPokemons(this.state.offset);
    }

    handleLoadMore = () => {
        const { loading, pokemons } = this.props;
        const { offset } = this.state;

        if (loading || pokemons.length >= 1025) return;

        this.setState({ loading: true });

        const newOffset = offset + 40;
        this.props.fetchPokemons(newOffset).then(() => {
            this.setState({
                offset: newOffset,
                loading: false,
            });
        });
    };

    renderFooter = () => {
        if (this.props.pokemons.length >= 1025) {
            return null;
        }
        return <LoadingSpinner />;
    };

    render() {

        const { pokemons, navigation } = this.props;

        const hexToRGBA = (hex, opacity) => {
            let r = 0, g = 0, b = 0;

            if (hex.length == 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            }

            else if (hex.length == 7) {
                r = parseInt(hex[1] + hex[2], 16);
                g = parseInt(hex[3] + hex[4], 16);
                b = parseInt(hex[5] + hex[6], 16);
            }
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        };

        const renderPokemons = ({ item }) => {

            const cardStyle = {
                ...styles.pokemonCard,
                backgroundColor: hexToRGBA(item.colors.primary.background, 0.85),
            };

            return (
                <TouchableOpacity onPress={() => navigation.navigate('Pokemon', { pokemonId: item.id })} style={styles.pokemonContainer}>
                    <View style={cardStyle}>

                        <View style={styles.textAndTypeContainer}>
                            <Text style={styles.name}>
                                {capitalizeFirstLetter(item.name)}
                            </Text>
                            <View style={styles.typesContainer}>
                                <Text style={styles.typeStyle}>
                                    {capitalizeFirstLetter(item.primary_type)}
                                </Text>
                                {item.secondary_type && (
                                    <Text style={styles.typeStyle}>
                                        {capitalizeFirstLetter(item.secondary_type)}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <Image source={require('../Images/pokeball.png')} style={styles.backgroundImg} />
                        <Image source={{ uri: item.image }} style={styles.img} />
                    </View>
                </TouchableOpacity>
            );
        };

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Pokedex</Text>
                </View>

                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPokemons}
                    numColumns={2}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.99}
                    ListFooterComponent={this.renderFooter}
                />
            </View>
        );

    }
}

const mapStateToProps = (state) => {
    return {
        pokemons: state.pokemon.pokemons,
        loading: state.pokemon.loading
    };
};

const mapDispatchToProps = {
    fetchPokemons,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatlist: {
        backgroundColor: 'gray'
    },
    header: {
        height: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    headerText: {
        fontSize: 30,
        color: '#000',
        fontWeight: 'bold',
        paddingLeft: 10
    },
    pokemonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    pokemonCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: 150,
        borderRadius: 20,
        padding: 20,
        overflow: 'hidden',
    },
    img: {
        position: 'absolute',
        width: 100,
        height: 100,
        right: 10,
        bottom: 10,
        zIndex: 1
    },
    backgroundImg: {
        position: 'absolute',
        width: 100,
        height: 100,
        right: -15,
        bottom: -15,
        zIndex: 0,
        opacity: 0.25,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#eee',
        alignSelf: 'flex-start',
        marginBottom: 15,
        marginTop: -5
    },
    typesContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeStyle: {
        padding: 7,
        borderRadius: 10,
        marginVertical: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: 'rgba(288,288,288, 0.2)',
        color: '#eee',
        fontSize: 12
    },
    textAndTypeContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        zIndex: 2,
    },
    primaryTypeStyle: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    }

});

const HomeConnect = connect(mapStateToProps, mapDispatchToProps)(Home);


export default HomeConnect;
