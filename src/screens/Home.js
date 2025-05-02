import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Menu } from 'react-native-paper';
import { fetchPokemons, clearFilteredList } from '../Actions/FetchPokemon';
import LoadingSpinner from './Components/LoadingSpinner';
import Divider from './Components/Divider';
import { capitalizeFirstLetter, hexToRGBA } from '../Utils/stringUtils';
import styles from './HomeStyles';
import { useDebounce } from 'use-debounce';

const Home = ({
  navigation,
  all,
  filtered,
  loading,
  fetchPokemons,
  clearFilteredList,
}) => {
  const limit = 50;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 1500);
  const [typePrimary, setTypePrimary] = useState('');
  const [typeSecondary, setTypeSecondary] = useState('');
  const [generation, setGeneration] = useState('');
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [result, setResult] = useState([]);

  const [typePrimaryMenuVisible, setTypePrimaryMenuVisible] = useState(false);
  const [typeSecondaryMenuVisible, setTypeSecondaryMenuVisible] =
    useState(false);
  const [generationMenuVisible, setGenerationMenuVisible] = useState(false);

  const flatListRef = useRef(null);

  const loadMorePokemons = useCallback(
    async (reset = false) => {
      if (loadingMore) return;

      const currentPage = reset ? 0 : page;
      const offset = currentPage * limit;
      const filters = {
        typePrimary,
        typeSecondary,
        generation,
        searchQuery: debouncedSearch,
      };
      const isFiltered =
        filters.typePrimary ||
        filters.typeSecondary ||
        filters.generation ||
        filters.searchQuery;

      setLoadingMore(true);
      const resultado = await fetchPokemons(offset, limit, filters);
      setResult(resultado);

      if (searchQuery.trim() !== '' && hasMore) {
        setHasMore(!(result.length === 1));
      } else {
        setHasMore(isFiltered ? result.length > 0 : result.length === limit);
      }

      setPage(reset ? 1 : currentPage + 1);
      setLoadingMore(false);

      if (reset && flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0 });
      }
    },
    [
      fetchPokemons,
      page,
      loadingMore,
      typePrimary,
      typeSecondary,
      generation,
      debouncedSearch,
    ]
  );

  useEffect(() => {
    if (typePrimary || typeSecondary) {
      clearFilteredList();
      loadMorePokemons(true);
    }
  }, [typePrimary, typeSecondary]);

  useEffect(() => {
    if (generation) {
      clearFilteredList();
      loadMorePokemons(true);
    }
  }, [generation]);

  useEffect(() => {
    clearFilteredList();
    loadMorePokemons(true);
  }, [debouncedSearch]);

  const clearFilters = () => {
    setSearchQuery('');
    setTypePrimary('');
    setTypeSecondary('');
    setGeneration('');
    setPage(0);
    setHasMore(true);
    clearFilteredList();
    loadMorePokemons(true);
  };

  useEffect(() => {
    setTypePrimary('');
    setTypeSecondary('');
    setGeneration('');
    setPage(0);
  }, [searchQuery]);

  const renderPaperSelect = (
    label,
    value,
    setValue,
    visible,
    setVisible,
    options
  ) => (
    <View style={styles.modalSelectorWrapper}>
      <Text style={styles.filterLabel}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            style={styles.paperSelectButton}
            labelStyle={styles.paperSelectButtonText}
            contentStyle={{ justifyContent: 'space-between' }}
          >
            {value || `Select ${label}`}
          </Button>
        }
      >
        {options.map((opt) => (
          <Menu.Item
            key={opt}
            title={opt}
            onPress={() => {
              setPage(0);
              setVisible(false);
              if (label === 'Generation') {
                setGeneration(opt);
              } else if (label === 'Primary Type') {
                setTypePrimary(opt);
              } else if (label === 'Secondary Type') {
                setTypeSecondary(opt);
              }
            }}
          />
        ))}
      </Menu>
    </View>
  );

  const renderFilters = () => {
    const types = [
      'Bug',
      'Dark',
      'Dragon',
      'Electric',
      'Fairy',
      'Fighting',
      'Fire',
      'Flying',
      'Ghost',
      'Grass',
      'Ground',
      'Ice',
      'Normal',
      'Poison',
      'Psychic',
      'Rock',
      'Steel',
      'Water',
    ];

    const generations = [
      'Generation I',
      'Generation II',
      'Generation III',
      'Generation IV',
      'Generation V',
      'Generation VI',
      'Generation VII',
      'Generation VIII',
      'Generation IX',
    ];

    return (
      showFilters && (
        <View style={styles.filterBox}>
          <Text style={styles.filtersTitle}>Search Filters</Text>
          <TextInput
            placeholder="Search by name"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
          />
          {renderPaperSelect(
            'Primary Type',
            typePrimary,
            setTypePrimary,
            typePrimaryMenuVisible,
            setTypePrimaryMenuVisible,
            types
          )}
          {renderPaperSelect(
            'Secondary Type',
            typeSecondary,
            setTypeSecondary,
            typeSecondaryMenuVisible,
            setTypeSecondaryMenuVisible,
            types
          )}
          {renderPaperSelect(
            'Generation',
            generation,
            setGeneration,
            generationMenuVisible,
            setGenerationMenuVisible,
            generations
          )}

          <TouchableOpacity
            onPress={clearFilters}
            style={styles.clearFiltersButton}
          >
            <Text style={styles.clearFiltersButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )
    );
  };

  const renderPokemons = ({ item }) => {
    const cardStyle = {
      ...styles.pokemonCard,
      backgroundColor: hexToRGBA(item.colors.primary.background, 0.85),
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Pokemon', { pokemonId: item.id })}
        style={styles.pokemonContainer}
      >
        <View style={cardStyle}>
          <View style={styles.textAndTypeContainer}>
            <Text style={styles.name}>{capitalizeFirstLetter(item.name)}</Text>
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
          <Image
            source={require('../Images/pokeball.png')}
            style={styles.backgroundImg}
          />
          <Image source={{ uri: item.image }} style={styles.img} />
        </View>
      </TouchableOpacity>
    );
  };

  const hasFilters = typePrimary || typeSecondary || generation || searchQuery;
  const pokemons = hasFilters ? filtered : all;
  const filteredBySearch = pokemons;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => flatListRef.current?.scrollToOffset({ offset: 0 })}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Scroll to Top</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderFilters()}

      {filteredBySearch.length > 0 || loading ? (
        <FlatList
          ref={flatListRef}
          data={filteredBySearch}
          keyExtractor={(item, index) => `${item.id}:${index}`}
          renderItem={renderPokemons}
          numColumns={2}
          ListFooterComponent={loadingMore ? <LoadingSpinner /> : null}
          onEndReached={() => {
            if (hasMore && !loadingMore) {
              loadMorePokemons();
            }
          }}
          onEndReachedThreshold={0.3}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      )}
    </View>
  );
};

const actions = {
  fetchPokemons,
  clearFilteredList,
};

const mapStateToProps = (state) => ({
  all: state.pokemon.all,
  filtered: state.pokemon.filtered,
  loading: state.pokemon.loading,
});

export default connect(mapStateToProps, actions)(Home);
