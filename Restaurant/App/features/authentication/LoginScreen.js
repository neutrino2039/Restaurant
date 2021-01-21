import {Button, Input, Text} from 'react-native-elements';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {clearErrors, login} from './AuthenticationSlice';
import {useDispatch, useSelector} from 'react-redux';

import ErrorView from '../components/ErrorView';
import {storeAccessToken} from '../../utilities/device';
import {unwrapResult} from '@reduxjs/toolkit';

const LoginScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const authentication = useSelector((state) => state.authentication);

  const canLogin = authentication.status !== 'loading';
  const errors = authentication.errors;

  const onLoginButtonPress = async () => {
    try {
      const loginAction = await dispatch(login({userName, password}));
      unwrapResult(loginAction);
      await storeAccessToken(authentication.data.token);
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <View style={styles.loginBox}>
        <Text h2 style={styles.loginHeader}>
          Restaurant Login
        </Text>
        <Input
          label="User Name"
          leftIcon={{type: 'font-awesome', name: 'user'}}
          onChangeText={(value) => setUserName(value)}
        />
        <Input
          label="Password"
          leftIcon={{type: 'font-awesome', name: 'lock'}}
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
        />
        <Button
          title="Login"
          icon={{type: 'font-awesome', name: 'sign-in'}}
          onPress={onLoginButtonPress}
          loading={!canLogin}
        />
        <Button
          title="Register"
          icon={{type: 'font-awesome', name: 'user-plus'}}
          containerStyle={styles.registerButton}
          disabled={!canLogin}
        />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  loginHeader: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 10,
  },
});
