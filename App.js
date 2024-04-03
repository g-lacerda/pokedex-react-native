import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/screens/Home';
import Pokemon from './src/screens/Pokemon';
import Loading from './src/screens/Loading';

import { configureStore } from '@reduxjs/toolkit';
import Reducers from './src/Reducers';

const store = configureStore({
  reducer: Reducers,
});

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const navigationRef = useRef(null);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Pokemon" component={Pokemon} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContent />
      </Provider>
    );
  }
}
