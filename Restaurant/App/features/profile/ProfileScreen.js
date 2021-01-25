import {StyleSheet, View} from 'react-native';
import {removeAccessToken, removeFromDevice} from '../../utilities/device';

import {Button} from 'react-native-elements';
import React from 'react';
import {logout} from '../authentication/AuthenticationSlice';
import {useDispatch} from 'react-redux';

export default ({navigation}) => {
  const dispatch = useDispatch();

  const onLogoutButtonPress = async () => {
    await removeAccessToken();
    await removeFromDevice('role');
    await dispatch(logout());
  };

  return (
    <View>
      <Button
        type="clear"
        title="Logout"
        onPress={onLogoutButtonPress}
        icon={{type: 'font-awesome', name: 'sign-out'}}
        style={styles.logoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoutButton: {},
});
