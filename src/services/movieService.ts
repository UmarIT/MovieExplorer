import axios from 'axios';

const API_URL = 'https://freetestapi.com/apis/movies';

export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  rating: number;
  image: string;
}

export const movieService = {
  async getAllMovies(): Promise<Movie[]> {
    const response = await axios.get(`${API_URL}/movies`);
    return response.data;
  },

  async getMovieById(id: number): Promise<Movie> {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  }
}; 