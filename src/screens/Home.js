import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Animated } from "react-native";
import { connect } from 'react-redux';
import { fetchPokemons } from '../Actions/FetchPokemon';
import LoadingSpinner from './Components/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Divider from "./Components/Divider";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export class Home extends Component {

    renderFooter = () => {
        if (this.props.pokemons.length >= 1025) {
            return null;
        }
        return <LoadingSpinner />;
    };

    clearFilters = () => {
        this.setState({
            searchQuery: '',
            typePrimary: '',
            typeSecondary: '',
            generation: '',
        });
    };

    state = {
        searchQuery: '',
        typePrimary: '',
        typeSecondary: '',
        generation: '',
    };

    applyFilter = () => {
        const { pokemons } = this.props;
        const { searchQuery, typePrimary, typeSecondary, generation } = this.state;

        if (!searchQuery && !typePrimary && !typeSecondary && !generation) {
            return pokemons;
        }




        return pokemons.filter((pokemon) => {

            return (
                pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (!typePrimary || pokemon.primary_type.toLowerCase() === typePrimary.toLowerCase()) &&
                (!typeSecondary || pokemon.secondary_type?.toLowerCase() === typeSecondary.toLowerCase()) &&
                (!generation || (pokemon.first_appearance == generation))
            );
        });
    };


    scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    };

    renderFilters = () => {
        const types = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'];
        const generations = ['Generation I', 'Generation II', 'Generation III', 'Generation IV', 'Generation V', 'Generation VII', 'Generation VIII'];

        return (
            <View>
                <View style={styles.filterContainer}>
                    <TextInput
                        placeholder="Search by name..."
                        placeholderTextColor='black'
                        style={styles.input}
                        onChangeText={(text) => this.setState({ searchQuery: text })}
                        value={this.state.searchQuery}
                    />
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={this.state.typePrimary}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ typePrimary: itemValue })
                            }>
                            <Picker.Item label="Select Primary Type" value="" />
                            {types.map((type, index) => (
                                <Picker.Item key={index} label={type} value={type} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={this.state.typeSecondary}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ typeSecondary: itemValue })
                            }>
                            <Picker.Item label="Select Secondary Type" value="" />
                            {types.map((type, index) => (
                                <Picker.Item key={index} label={type} value={type} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.pickerContainer}>

                        <Picker
                            selectedValue={this.state.generation}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ generation: itemValue })
                            }>
                            <Picker.Item label="Select Generation" value="" />
                            {generations.map((gen, index) => (
                                <Picker.Item key={index} label={gen} value={gen} />
                            ))}
                        </Picker>
                    </View>


                    <TouchableOpacity onPress={this.clearFilters} style={styles.clearFiltersButton}>
                        <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
                    </TouchableOpacity>
                </View>

                <Divider
                    width={40}
                    marginVertical={30}
                />
            </View>
        );
    };


    render() {

        const { navigation } = this.props;

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
                    <TouchableOpacity onPress={this.scrollToTop} style={styles.returnToTopButton}>
                        <Text style={styles.returnToTopText}>Return to Top</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    data={this.applyFilter()}
                    keyExtractor={(item, index) => item.id.toString() + ':' + index}
                    renderItem={renderPokemons}
                    numColumns={2}
                    ListHeaderComponent={this.renderFilters}
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
    filterContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatlist: {
        backgroundColor: 'gray'
    },
    input: {
        height: 50,
        width: '65%',
        marginTop: 20,
        padding: 10,
        paddingLeft: 18,
        color: 'black',
        borderRadius: 20,
        backgroundColor: 'white',
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 20,
        overflow: 'hidden'
    },
    pickerContainer: {
        height: 50,
        width: '65%',
        marginVertical: 10,
        borderRadius: 20,
        overflow: 'hidden'
    },
    pickerItem: {
        color: 'black',
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
    },
    returnToTopButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        padding: 10,
        backgroundColor: '#f95e5e',
        borderRadius: 20,
    },
    returnToTopText: {
        color: '#ffffff',
        fontWeight: 'bold'
    },
    clearFiltersButton: {
        marginTop: 10,
        backgroundColor: '#f95e5e',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '30%',
    },
    clearFiltersButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

const HomeConnect = connect(mapStateToProps, mapDispatchToProps)(Home);


export default HomeConnect;
