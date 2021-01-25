import 'react-native-gesture-handler';

import CreateRestaurantScreen from '../features/home/CreateRestaurantScreen';
import CreateUserScreen from '../features/users/CreateUserScreen';
import DetailsScreen from '../features/home/DetailsScreen';
import HomeScreen from '../features/home/HomeScreen';
import {Icon} from 'react-native-elements';
import LoginScreen from '../features/authentication/LoginScreen';
import PendingReviewsScreen from '../features/pending-reviews/PendingReviewsScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import {ROLES} from '../features/authentication/AuthenticationSlice';
import React from 'react';
import RegisterScreen from '../features/authentication/RegisterScreen';
import SplashScreen from '../features/splash-screen/SplashScreen';
import UpdateDeleteRestaurantScreen from '../features/home/UpdateDeleteRestaurantScreen';
import UpdateDeleteUserScreen from '../features/users/UpdateDeleteUserScreen';
import UsersScreen from '../features/users/UsersScreen';
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
            options={({route}) => ({
              headerTitle: getHeaderTitleForTabBar(route),
            })}
          />
          {authentication.role === ROLES.REGULAR ? (
            <Stack.Screen name="Details" component={DetailsScreen} />
          ) : (
            <>
              <Stack.Screen name="Details" component={PendingReviewsScreen} />
              <Stack.Screen
                name="CreateRestaurant"
                component={CreateRestaurantScreen}
                options={({route}) => ({headerTitle: getHeaderTitle(route)})}
              />
              <Stack.Screen
                name="UpdateDeleteRestaurant"
                component={UpdateDeleteRestaurantScreen}
                options={({route}) => ({headerTitle: getHeaderTitle(route)})}
              />
              <Stack.Screen
                name="CreateUser"
                component={CreateUserScreen}
                options={({route}) => ({headerTitle: getHeaderTitle(route)})}
              />
              <Stack.Screen
                name="UpdateDeleteUser"
                component={UpdateDeleteUserScreen}
                options={({route}) => ({headerTitle: getHeaderTitle(route)})}
              />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

const BottomTabBar = () => {
  const authentication = useSelector((state) => state.authentication);
  return (
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
      {authentication.role === ROLES.ADMIN && (
        <Tab.Screen
          name="Users"
          component={UsersScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Icon type="font-awesome" name="users" color={color} />
            ),
            tabBarLabel: 'Users',
          }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon type="font-awesome" name="address-card" color={color} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const getHeaderTitleForTabBar = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  if (routeName === 'NewRestaurant') return 'New Restaurant';
  return routeName;
};

const getHeaderTitle = (route) => {
  if (route.name === 'CreateRestaurant') return 'Create Restaurant';
  if (route.name === 'UpdateDeleteRestaurant')
    return 'Update/Delete Restaurant';
  if (route.name === 'CreateUser') return 'Create User';
  if (route.name === 'UpdateDeleteUser') return 'Update/Delete User';
  return route.name;
};
