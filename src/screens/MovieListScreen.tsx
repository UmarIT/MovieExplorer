import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MovieListStackParamList } from '../types/navigation';
import { movieApi, Movie, PaginatedResponse } from '../services/movieApi';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { RootState } from '../store';

type MovieListScreenNavigationProp = NativeStackNavigationProp<MovieListStackParamList, 'MovieList'>;

interface MovieListScreenProps {
  navigation: MovieListScreenNavigationProp;
}

const MovieListScreen: React.FC<MovieListScreenProps> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const favorites = useSelector((state: RootState) => state.favorites.movies);
  const dispatch = useDispatch();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const response: PaginatedResponse = searchQuery
        ? await movieApi.searchMovies(searchQuery, pageNum)
        : await movieApi.getMovies(pageNum);
      
      if (pageNum === 1) {
        setMovies(response.movies);
      } else {
        setMovies(prevMovies => [...prevMovies, ...response.movies]);
      }
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    setPage(1);
    setHasMore(true);
    loadMovies(1);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMovies(page + 1);
    }
  };

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
    } else {
      dispatch(addFavorite(movie));
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
    >
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
        onError={() => console.log('Error loading image')}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.year}>{item.year}</Text>
        <Text style={styles.rating}>Rating: {item.rating}/10</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.favoriteButtonText}>
            {favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderLoadMoreButton = () => {
    if (!hasMore || loadingMore) return null;
    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
      >
        <Text style={styles.loadMoreButtonText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  if (loading && !loadingMore) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadMovies(1)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      {renderLoadMoreButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
  },
  list: {
    padding: 10,
  },
  movieCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 150,
  },
  movieInfo: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  year: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  favoriteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MovieListScreen; 