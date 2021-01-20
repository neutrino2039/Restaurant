import 'react-native-gesture-handler';

import LoginScreen from '../features/authentication/login/LoginScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="LoginScreen"
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
};
