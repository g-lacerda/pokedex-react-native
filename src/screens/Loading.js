import React, { Component } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';
import { connect } from 'react-redux';
import { fetchPokemons } from '../Actions/FetchPokemon';

const initialPokemonFacts = [
    "Did you know? Pikachu was not originally designed as the mascot of Pokémon.",
    "Pokémon Gold and Silver were initially supposed to be the final games in the series.",
    "The idea for Pokémon came to Satoshi Tajiri from his childhood interest in collecting creatures.",
    "Eevee can evolve into more different Pokémon than any other species discovered so far.",
    "The name Pokémon is a romanized contraction of the Japanese brand Pocket Monsters (ポケットモンスター).",
    "Gengar is thought to be a shadow of Clefable, given their similar shapes and weight.",
    "Mewtwo was the first Pokémon ever created by humans.",
    "Wobbuffet's body is actually just a decoy, and its tail is considered the real Pokémon.",
    "Arceus is known as 'The Original One' as it is said to have created the Pokémon universe.",
    "Magikarp evolves into Gyarados, symbolizing the myth of the carp leaping over the dragon gate.",
    "The design of Butterfree was originally intended for Venomoth, and vice versa.",
    "Hitmonlee and Hitmonchan are based on Bruce Lee and Jackie Chan respectively.",
    "The Pokémon Ditto can transform into any Pokémon, mirroring its opponent's appearance and abilities.",
    "Zubat is notoriously known for frequently appearing in caves, often to the player's annoyance.",
    "Psyduck's headache can become so severe that it releases tension in the form of psychic powers.",
    "Lugia’s wings pack devastating power - a light fluttering of its wings can blow apart regular houses.",
    "Pikachu's design was inspired by a squirrel, not a mouse.",
    "The mythical Pokémon Hoopa can summon anything with its rings, including other Pokémon.",
    "Lucario can communicate with humans through telepathy.",
    "Squirtle's shell not only provides protection but also minimizes water resistance, allowing it to swim at high speeds.",
    "The move 'Splash' is famously useless, despite its energetic name.",
    "Snorlax was designed based on a combination of a panda and a teddy bear.",
    "The creators initially considered naming Pokémon as 'Capsule Monsters'.",
    "Jigglypuff's lullaby can put anyone to sleep, regardless of their willingness.",
    "The idea of 'shiny' Pokémon was introduced in the second generation, offering rare color variants.",
    "Meowth is one of the few Pokémon that can speak human language.",
    "Ash Ketchum’s name in Japanese is Satoshi, named after Pokémon creator Satoshi Tajiri.",
    "Pokémon X and Y were the first games in the series that allowed trainers to fully customize their appearance.",
    "In Pokémon mythology, Mew contains the DNA of every single Pokémon.",
    "Poliwag’s swirl pattern is based on the visible intestines of tadpoles.",
    "Alakazam’s IQ is over 5000, making it incredibly intelligent.",
    "Pokémon Red and Blue hold the record for the best-selling RPGs on the Game Boy.",
    "The Pokémon Company is jointly owned by Nintendo, Game Freak, and Creatures.",
    "Spinda is a Pokémon that has over 4 billion possible spot combinations.",
    "The Pokémon world includes various regions, each based on real-world locations.",
    "Clefairy was originally going to be the mascot of Pokémon instead of Pikachu.",
    "Gyarados is based on a Chinese legend where a carp turns into a dragon.",
    "Dragonite can fly faster than the speed of sound.",
    "Pokémon Go, the mobile game, led to a surge in outdoor activity among players worldwide.",
    "Raichu has a long tail that serves as a ground to protect itself from its own high voltage power.",
    "Charizard’s flame burns hotter if it has experienced tough battles.",
    "Each Spinda’s spot pattern is unique, mirroring the concept of human fingerprints.",
    "Bulbasaur is the first Pokémon listed in the National Pokédex.",
    "The legendary birds Articuno, Zapdos, and Moltres have names ending in Spanish numbers uno, dos, tres.",
    "Porygon is the first artificial Pokémon created by scientists.",
    "Eevee has the most evolutions of any Pokémon, offering various evolutionary paths.",
    "The Ghost-type Pokémon Gastly is mostly composed of gas.",
    "Manaphy is the only legendary Pokémon that can breed.",
    "Pokémon Diamond and Pearl were the first to introduce online trading and battling.",
    "Abra sleeps for 18 hours a day and teleports to safety if it senses danger while asleep.",
    "Cherubi uses the nutrient from its bright red berry to gain energy.",
    "Sableye is based on the Hopkinsville Goblin, an alien from American folklore.",
    "Shedinja is a shed husk Pokémon that can only be obtained when Nincada evolves.",
    "Whiscash can predict earthquakes.",
    "Skitty and Wailord can breed, despite their immense size difference.",
    "Lapras was designed to resemble the mythical Loch Ness monster.",
    "Farfetch’d is always seen with a leek because it can’t live without it according to lore.",
    "A group of Exeggutor is called a coconut grove.",
    "Ditto’s transformation abilities extend to mimicry outside of battle, making it a master of disguise.",
    "Onix can burrow at over 50 miles per hour.",
    "The move 'Fly' was first introduced as a HM, allowing players to travel to previously visited locations.",
    "Slowbro is the only Pokémon that can devolve back into its previous form under certain conditions in lore.",
    "Venusaur’s flower is said to take on vivid colors when it gets plenty of nutrition and sunlight.",
    "Pikachu’s design was inspired by a mix of a squirrel and a rabbit.",
    "Feebas evolves into Milotic, symbolizing the idea of inner beauty and growth.",
    "Cubone wears the skull of its deceased mother as a helmet.",
    "Espeon is a psychic Pokémon that can predict the future.",
    "Umbreon evolved as a result of being exposed to the moon’s waves.",
    "Jirachi can grant any wish when it is awake.",
    "Deoxys has multiple forms, each with different stats and abilities.",
    "Mudkip uses the fin on its head to detect changes in air and water currents.",
    "Infernape’s design is inspired by Sun Wukong from the Journey to the West, a classic Chinese novel.",
    "Empoleon, the emperor Pokémon, is named after Napoleon Bonaparte.",
    "Luxray’s eyes can see through solid objects.",
    "Garbodor, a Pokémon that resembles a pile of trash, sparks debates about environmentalism.",
    "Zekrom represents ideals, while Reshiram represents truth in Pokémon mythology.",
    "Vanilluxe, a Pokémon that looks like an ice cream cone, often receives mixed reactions from fans.",
    "Talonflame can reach speeds of up to 310 mph when diving.",
    "Sylveon is the first Fairy-type Pokémon introduced in the series.",
    "Hawlucha is based on Mexican luchadores (wrestlers).",
    "Decidueye is based on an owl archer, drawing inspiration from Robin Hood.",
    "Primarina sings beautiful songs that can control water bubbles.",
    "Greninja can compress water into sharp-edged throwing stars.",
    "Litten’s fur is rich in oils and highly flammable.",
    "Zygarde’s forms are inspired by Norse mythology, representing the world tree Yggdrasil.",
    "Tapu Koko is a guardian deity of the Alola region, known for its fierce protective nature.",
    "Marshadow is capable of hiding within shadows.",
    "Necrozma’s light is said to be the brightest in the Pokémon world.",
    "Inteleon’s design is inspired by spies, featuring various gadgets.",
    "Toxtricity can generate electricity through the chemical reactions between its toxins.",
    "Dragapult launches its Dreepy like missiles when attacking.",
    "Zamazenta’s shield form can withstand any attack.",
    "Eternatus is responsible for the Dynamax phenomenon in the Galar region.",
    "Kubfu trains diligently, aspiring to master the art of combat.",
    "Urshifu has two distinct styles, reflecting its training under harsh conditions.",
    "Regieleki and Regidrago were created by Regigigas.",
    "Glastrier embodies the harsh cold, while Spectrier embodies the chilling ghostly whispers.",
    "Calyrex is revered as a king in legends, known for its noble demeanor.",
    "Zarude can grow vines from the back of its neck, wrists, and the soles of its feet.",
    "Diancie is born from a Carbink that undergoes a mutation.",
    "Volcanion expels steam of such great power that it can destroy mountains.",
    "Silvally was created to combat the Ultra Beasts.",
    "Zeraora can generate powerful electric currents using its paw pads.",
    "Naganadel, a Poison/Dragon Ultra Beast, evolves from Poipole when it learns Dragon Pulse.",
    "Stakataka resembles a fortress and is composed of many individual life forms.",
    "Blacephalon, an Ultra Beast, can create and detonate its own head.",
];

function shuffleFacts(facts) {
    for (let i = facts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [facts[i], facts[j]] = [facts[j], facts[i]];
    }
    return facts;
}

class Loading extends Component {
    state = {
        rotation: new Animated.Value(0),
        factIndex: 0,
        pokemonFacts: shuffleFacts([...initialPokemonFacts]),
    };

    componentDidMount() {
        this.animate();
        this.props.fetchPokemons().then(() => {
            this.props.navigation.navigate('Home');
        });
        this.factInterval = setInterval(this.rotateFacts, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.factInterval);
    }

    rotateFacts = () => {
        this.setState(prevState => ({
            factIndex: (prevState.factIndex + 1) % prevState.pokemonFacts.length
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
                <View style={styles.spaceContainer}>
                </View>
                <View style={styles.imageContainer}>
                    <Animated.Image
                        source={require('../Images/pokeball.png')}
                        style={[styles.img, { transform: [{ rotate: spin }] }]}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>The first load might take a while...</Text>
                    <Text style={styles.text}>We are preparing your Pokédex!</Text>

                    <Text style={styles.textFunFact}>Meanwhile, read some fun facts about Pokémon!</Text>
                    <Text style={styles.funFact}>{pokemonFacts[factIndex]}</Text>
                </View>
            </View>
        );
    }
}

const mapDispatchToProps = {
    fetchPokemons,
};

export default connect(null, mapDispatchToProps)(Loading);


const styles = StyleSheet.create({

    spaceContainer: {
        flex: 0.8,
    },
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f95e5e',
        paddingTop: 30
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
        marginTop: 15
    },
    funFact: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#eee',
        fontSize: 26,
        marginHorizontal: 15
    },

});
