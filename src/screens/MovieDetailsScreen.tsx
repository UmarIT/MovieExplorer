import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MovieListStackParamList } from '../types/navigation';
import { movieApi, Movie } from '../services/movieApi';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { RootState } from '../store';

type MovieDetailsScreenNavigationProp = NativeStackNavigationProp<MovieListStackParamList, 'MovieDetails'>;

interface MovieDetailsScreenProps {
  navigation: MovieDetailsScreenNavigationProp;
  route: {
    params: {
      movieId: number;
    };
  };
}

const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({ navigation, route }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const favorites = useSelector((state: RootState) => state.favorites.movies);
  const dispatch = useDispatch();

  useEffect(() => {
    loadMovieDetails();
  }, [route.params.movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieApi.getMovieById(route.params.movieId);
      setMovie(data);
    } catch (err) {
      setError('Failed to load movie details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (movie) {
      const isFavorite = favorites.some(fav => fav.id === movie.id);
      if (isFavorite) {
        dispatch(removeFavorite(movie.id));
      } else {
        dispatch(addFavorite(movie));
      }
    }
  };

  if (loading) {
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
        <TouchableOpacity style={styles.retryButton} onPress={loadMovieDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  const isFavorite = favorites.some(fav => fav.id === movie.id);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: movie.poster }}
        style={styles.poster}
        onError={() => console.log('Error loading image')}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{movie.title}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <Text style={styles.favoriteButtonText}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.year}>Year: {movie.year}</Text>
        <Text style={styles.director}>Director: {movie.director}</Text>
        <View style={styles.genresContainer}>
          {movie.genre.map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.rating}>Rating: {movie.rating}/10</Text>
        <Text style={styles.plotTitle}>Plot</Text>
        <Text style={styles.plot}>{movie.plot}</Text>
      </View>
    </ScrollView>
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
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteButton: {
    padding: 10,
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  year: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  director: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  genreTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  plotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default MovieDetailsScreen; 