import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {Text} from 'react-native-elements';
import {retrieveAccessToken} from '../../utilities/device';
import {setAccessToken} from '../authentication/AuthenticationSlice';
import {setLoading} from '../splash-screen/SplashScreenSlice';
import {useDispatch} from 'react-redux';

export default ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getAccessToken = async () => {
      var token = await retrieveAccessToken();
      await dispatch(setAccessToken(token));
      await dispatch(setLoading(false));
    };
    getAccessToken();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text h2>Restaurant</Text>
      <Text h2>Review</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'darkgreen',
  },
});
