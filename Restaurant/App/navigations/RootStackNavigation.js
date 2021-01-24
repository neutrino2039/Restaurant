import 'react-native-gesture-handler';

import DetailsScreen from '../features/home/DetailsScreen';
import HomeScreen from '../features/home/HomeScreen';
import {Icon} from 'react-native-elements';
import LoginScreen from '../features/authentication/LoginScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import React from 'react';
import RegisterScreen from '../features/authentication/RegisterScreen';
import SplashScreen from '../features/splash-screen/SplashScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        <>
          <Stack.Screen
            name="Home"
            component={BottomTabBar}
            options={({route}) => ({headerTitle: getHeaderTitle(route)})}
          />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const BottomTabBar = () => (
  <Tab.Navigator tabBarOptions={{activeTintColor: 'brown'}}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({color}) => (
          <Icon type="font-awesome" name="home" color={color} />
        ),
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({color}) => (
          <Icon type="font-awesome" name="user" color={color} />
        ),
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

function getHeaderTitle(route) {
  return getFocusedRouteNameFromRoute(route) ?? 'Home';
}
