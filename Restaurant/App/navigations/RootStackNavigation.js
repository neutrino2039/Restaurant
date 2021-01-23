import 'react-native-gesture-handler';

import HomeScreen from '../features/home/HomeScreen';
import LoginScreen from '../features/authentication/LoginScreen';
import React from 'react';
import RegisterScreen from '../features/authentication/RegisterScreen';
import SplashScreen from '../features/splash-screen/SplashScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();

export default () => {
  const splashScreen = useSelector((state) => state.splashScreen);
  const authentication = useSelector((state) => state.authentication);

  if (splashScreen.isLoading) return <SplashScreen />;

  return (
    <Stack.Navigator>
      {!authentication.isAuthenticated ? (
        <>
          <Stack.Screen
            options={{headerShown: false}}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Register"
            component={RegisterScreen}
          />
        </>
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
};
