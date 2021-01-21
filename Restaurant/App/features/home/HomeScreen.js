import {Button, Text} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';

import React from 'react';
import {logout} from '../authentication/AuthenticationSlice';
import {removeAccessToken} from '../../utilities/device';
import {useDispatch} from 'react-redux';

export default ({navigation}) => {
  const dispatch = useDispatch();

  const onLogoutButtonPress = async () => {
    await removeAccessToken();
    await dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text h2>Home Screen</Text>
      <Button title="Logout" onPress={onLogoutButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
