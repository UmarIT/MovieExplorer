import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieListScreen from '../screens/MovieListScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { MainTabParamList, HomeStackParamList } from '../types/navigation';
import { Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity
            onPress={handleLogout}
            style={{ marginRight: 15 }}
          >
            <Text style={{ color: '#007AFF', fontSize: 16 }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <HomeStack.Screen 
        name="MovieList" 
        component={MovieListScreen} 
        options={{ title: 'Movies' }}
      />
      <HomeStack.Screen 
        name="MovieDetails" 
        component={MovieDetailsScreen} 
        options={{ title: 'Movie Details' }}
      />
    </HomeStack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Text style={{ color }}>🎬</Text>,
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color }}>⭐</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 