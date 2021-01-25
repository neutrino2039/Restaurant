import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

export const storeToDevice = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {}
};

export const retrieveFromDevice = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export const removeFromDevice = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

export const storeAccessToken = async (token) => {
  return await storeToDevice(ACCESS_TOKEN, token);
};

export const retrieveAccessToken = async () => {
  return await retrieveFromDevice(ACCESS_TOKEN);
};

export const removeAccessToken = async () => {
  return await removeFromDevice(ACCESS_TOKEN);
};

export const accessTokenExists = async () => {
  return (await retrieveAccessToken()) !== null;
};

export const relativeTime = (dateTime) => {
  return Moment.utc(dateTime).fromNow();
};

export const confirmDelete = ({title, message, onYesPress = () => {}}) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'No',
        onPress: () => {
          console.log('delete canceled.');
        },
        style: 'cancel',
      },
      {text: 'Yes', onPress: onYesPress},
    ],
    {cancelable: false},
  );
};
