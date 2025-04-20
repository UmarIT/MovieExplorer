/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { checkAuth } from './src/store/authSlice';

export default function App() {
  useEffect(() => {
    // Check for existing authentication
    store.dispatch(checkAuth());
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
