import axios from 'axios';

const BASE_URL = 'https://freetestapi.com/api/v1/movies';
const ITEMS_PER_PAGE = 10;

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  genre: string[];
  plot: string;
  rating: number;
  poster: string;
}

export interface PaginatedResponse {
  movies: Movie[];
  hasMore: boolean;
}

export const movieApi = {
  /**
   * Fetches movies with pagination
   * @param page - The page number (1-based)
   * @param limit - Number of items per page
   */
  getMovies: async (page: number = 1, limit: number = ITEMS_PER_PAGE): Promise<PaginatedResponse> => {
    try {
      const response = await axios.get(BASE_URL);
      const allMovies = response.data;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMovies = allMovies.slice(startIndex, endIndex);
      
      return {
        movies: paginatedMovies,
        hasMore: endIndex < allMovies.length
      };
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error('Failed to fetch movies');
    }
  },

  /**
   * Fetches a single movie by its ID
   * @param id - The movie ID
   */
  getMovieById: async (id: number): Promise<Movie> => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  },

  /**
   * Searches movies with pagination
   * @param query - Search query
   * @param page - The page number (1-based)
   * @param limit - Number of items per page
   */
  searchMovies: async (query: string, page: number = 1, limit: number = ITEMS_PER_PAGE): Promise<PaginatedResponse> => {
    try {
      const response = await axios.get(BASE_URL);
      const allMovies = response.data;
      const filteredMovies = allMovies.filter((movie: Movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
      
      return {
        movies: paginatedMovies,
        hasMore: endIndex < filteredMovies.length
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  }
}; 