import React, { useEffect, useRef, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
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
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.pokemon.loading);
  const navigationRef = useRef(null);

  const [minLoadingDone, setMinLoadingDone] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 3000);


    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {

    if (!loading && minLoadingDone) {
      if (navigationRef.current) {
        navigationRef.current.navigate('Home');
      }
    }
  }, [loading, minLoadingDone]);



  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Pokemon" component={Pokemon} />
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
