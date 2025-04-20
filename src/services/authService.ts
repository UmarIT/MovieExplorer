import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://reqres.in/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id?: number;
  email?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // ReqRes API requires specific email format
      const response = await axios.post(`${API_URL}/login`, {
        email: credentials.email,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500 // Accept 400 as valid response
      });

      if (response.status === 400) {
        throw new Error('Invalid email or password');
      }

      const { token } = response.data;
      if (!token) {
        throw new Error('No token received');
      }

      await AsyncStorage.setItem('token', token);
      return { token };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error('Invalid email or password');
        }
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email: credentials.email,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500
      });

      if (response.status === 400) {
        throw new Error('Email already exists or invalid password');
      }

      const { token, id } = response.data;
      if (!token) {
        throw new Error('No token received');
      }

      await AsyncStorage.setItem('token', token);
      return { token, id };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error('Email already exists or invalid password');
        }
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
  },

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }
}; 