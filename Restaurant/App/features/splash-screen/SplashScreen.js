import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {retrieveAccessToken, retrieveFromDevice} from '../../utilities/device';

import {Text} from 'react-native-elements';
import {setAccessToken} from '../authentication/AuthenticationSlice';
import {setLoading} from '../splash-screen/SplashScreenSlice';
import {useDispatch} from 'react-redux';

export default ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const retrieveSavedData = async () => {
      const role = await retrieveFromDevice('role');
      const token = await retrieveAccessToken();
      await dispatch(setAccessToken({role, token}));
      await dispatch(setLoading(false));
    };

    retrieveSavedData();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text h2 style={styles.text}>
        Restaurant
      </Text>
      <Text h2 style={styles.text}>
        Review
      </Text>
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
    color: 'green',
  },
});
