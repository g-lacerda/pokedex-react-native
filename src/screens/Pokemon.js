import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ProgressBar from './Components/ProgressBar';
import Divider from './Components/Divider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

class Pokemon extends React.Component {

    state = {
        activeTab: 'About',
    };

    findPokemonById = () => {
        const { pokemons, route } = this.props;
        const { pokemonId } = route.params;
        return pokemons.find(pokemon => pokemon.id === pokemonId);
    }

    renderTabs() {
        const { activeTab } = this.state;
        return (
            <View style={styles.tabsContainer}>
                {['About', 'Base Stats', 'Evolution', 'Moves'].map((tab) => (
                    <Text
                        key={tab}
                        style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTab
                        ]}
                        onPress={() => this.setState({ activeTab: tab })}
                    >
                        {tab}
                    </Text>
                ))}
            </View>
        );
    }

    adjustDescriptionText = (description) => {
        return description.replace(/POKéMON/g, 'POKÉMON');
    };

    rotation = new Animated.Value(1);

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        this.rotation.setValue(0);
        Animated.timing(this.rotation, {
            toValue: 1,
            duration: 2400,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(this.animate, 200);
        });
    };

    render() {

        const { navigation } = this.props;

        const rotation = this.rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        const pokemon = this.findPokemonById();
        console.log(pokemon);

        if (!pokemon) {
            return <Text>Pokémon não encontrado.</Text>;
        }

        const pokemonViewContainer = {
            backgroundColor: pokemon.colors.primary.background,
            height: 250
        };

        const rootView = {
            backgroundColor: pokemon.colors.primary.background,
            flex: 1
        };

        const containerScrollView = {
            ...styles.containerScrollView,
            backgroundColor: pokemon.colors.primary.background,
            flex: 1
        };


        return (
            <View style={rootView}>
                <View style={pokemonViewContainer}>
                    <View style={styles.textAndTypeContainer}>
                        <View style={styles.backButton}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                activeOpacity={1}
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    color="#eee"
                                    size={40}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.name}>
                            {capitalizeFirstLetter(pokemon.name)}
                        </Text>
                        <View style={styles.typesContainer}>
                            <Text style={styles.typeStyle}>
                                {capitalizeFirstLetter(pokemon.primary_type)}
                            </Text>
                            {pokemon.secondary_type && (
                                <Text style={styles.typeStyle}>
                                    {capitalizeFirstLetter(pokemon.secondary_type)}
                                </Text>
                            )}
                        </View>
                    </View>
                    <Animated.Image source={require('../Images/pokeball.png')} style={[styles.backgroundImg, { transform: [{ rotate: rotation }] }]} />
                    <Image source={{ uri: pokemon.image }} style={styles.img} />
                </View>


                <View style={containerScrollView}>
                    <View style={styles.scrollView}>
                    {this.renderTabs()}
                    <ScrollView style={styles.scrollView}>
                        {this.renderContent()}
                    </ScrollView>
                    </View>
                </View>
            </View>

        );
    }

    renderContent() {

        const pokemon = this.findPokemonById();

        if (!pokemon) {
            return <Text>Pokémon não encontrado.</Text>;
        }

        const adjustedDescription = this.adjustDescriptionText(pokemon.description);

        const { activeTab } = this.state;
        switch (activeTab) {
            case 'About':
                return (
                    <View>
                        <Text style={styles.descriptionText}>{adjustedDescription}</Text>

                        <Divider
                            width={40}
                            marginVertical={30}
                        />

                        <Text style={styles.moduleLabel}>Breeding</Text>
                        <View style={styles.genderRateContainer}>

                            <Text style={styles.infoModuleLabel}>Gender: </Text>


                            <View style={styles.genderProgressContainer}>
                                <Ionicons
                                    name="male"
                                    color="#2a45f7"
                                    size={25}
                                />
                                <Text style={styles.valueText}>{pokemon.gender_rate.male}%</Text>

                            </View>
                            <View style={styles.genderProgressContainer}>
                                <Ionicons
                                    name="female"
                                    color="#f72af7"
                                    size={25}
                                />
                                <Text style={styles.valueText}>{pokemon.gender_rate.female}%</Text>

                            </View>



                        </View>
                        <View style={styles.genderRateContainer}>

                            <Text style={styles.infoModuleLabel}>Egg Groups: </Text>
                            <Text style={styles.statLabel}>
                                {pokemon.egg_groups.map(eggGroup => eggGroup.name).join(', ')}
                            </Text>
                        </View>
                    </View>
                );
            case 'Base Stats':
                return (
                    <View>
                        <Text style={styles.moduleLabel}>Stats</Text>

                        <View>
                            {pokemon.stats.map(stat => (
                                <View>
                                    <View key={stat.name} style={styles.statContainer}>
                                        <Text style={styles.statLabel}>{`${capitalizeFirstLetter(stat.name)}: `}</Text>
                                        <Text style={styles.valueText}>{stat.base_stat}</Text>
                                        <View style={styles.progressBarContainer}>
                                            <ProgressBar
                                                progress={(stat.base_stat / 255) * 100}
                                                progressColor={pokemon.colors.primary.background}
                                                backgroundColor="#a6a6a6"
                                            />
                                        </View>

                                    </View>
                                    <Divider
                                        width={50}
                                        marginVertical={15}
                                    />
                                </View>

                            ))}
                        </View>
                    </View>
                );
            case 'Evolution':
                return (
                    <View>
                        {pokemon.evolutions.map((evolution, index) => (
                            <View key={index} style={{ alignItems: 'center', marginBottom: 20 }}>
                                {index > 0 && <Ionicons name="arrow-down" color="#000" size={40} />}
                                <Text style={styles.descriptionText}>{evolution.name}</Text>
                                <Text style={styles.descriptionText}>
                                    Level {(evolution.min_level === undefined || evolution.min_level === 0) ? "1" : evolution.min_level.toString()}
                                </Text>
                                <Image source={{ uri: evolution.image }} style={styles.evolutionsImages} />
                            </View>
                        ))}
                    </View>
                );
            case 'Moves':
                return (
                    <View>
                        <Text style={styles.contentText}>/* Conteúdo de Moves aqui */</Text>
                    </View>
                );
            default:
                return (
                    <View>
                        <Text style={styles.contentText}>Select a tab</Text>
                    </View>
                );
        }
    }
}


const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const styles = StyleSheet.create({
    containerScrollView: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        overflow: 'hidden',
        flex: 1
    },
    scrollView: {
        padding: 20,
        backgroundColor: '#eee',
        flex: 1
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
        paddingHorizontal: 10
    },
    progressBarContainer: {
        flex: 2,
        justifyContent: 'flex-start',
    },
    img: {
        position: 'absolute',
        width: 300,
        height: 300,
        right: 0,
        bottom: 0,
        zIndex: 1
    },
    evolutionsImages: {
        width: 200,
        height: 200
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
        fontSize: 20
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
        marginTop: 10,
        marginBottom: 30,
    },
    tabText: {
        padding: 10,
        fontWeight: 'bold',
        color: 'grey',
    },
    activeTab: {
        color: 'black',
        borderBottomWidth: 2,
        borderBottomColor: 'navy',
    },
    backButton: {
        paddingBottom: 15
    }
});

const mapStateToProps = (state) => ({
    pokemons: state.pokemon.pokemons,
});

export default connect(mapStateToProps)(Pokemon);
