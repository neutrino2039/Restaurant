import AsyncStorage from '@react-native-async-storage/async-storage';

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
  console.log('access token saved: ' + token);
  return await storeToDevice(ACCESS_TOKEN, token);
};

export const retrieveAccessToken = async () => {
  return await retrieveFromDevice(ACCESS_TOKEN);
};

export const removeAccessToken = async () => {
  return await removeFromDevice(ACCESS_TOKEN);
};

export const accessTokenExists = async (token) => {
  return (await retrieveAccessToken()) !== null;
};
