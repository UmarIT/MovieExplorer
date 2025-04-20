export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string }[];
}

export interface MovieState {
  movies: Movie[];
  selectedMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  searchResults: Movie[];
  searchQuery: string;
} 