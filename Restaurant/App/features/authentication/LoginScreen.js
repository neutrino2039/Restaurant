import {Button, Input, Text} from 'react-native-elements';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {clearErrors, login, setErrors} from './AuthenticationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {validatePassword, validateUserName} from '../../validations/user';

import ErrorView from '../components/ErrorView';
import {storeAccessToken} from '../../utilities/device';
import {unwrapResult} from '@reduxjs/toolkit';
import {validateAll} from '../../validations/validation';

export default ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const authentication = useSelector((state) => state.authentication);

  const canLogin = authentication.status !== 'loading';
  const errors = authentication.errors;

  const onLoginButtonPress = async () => {
    if (!(await validate())) return;
    try {
      const loginAction = await dispatch(login({userName, password}));
      const result = unwrapResult(loginAction);
      await storeAccessToken(result.token);
    } catch (error) {}
  };

  const validate = async () => {
    const result = validateAll([
      [validateUserName, userName],
      [validatePassword, password],
    ]);
    await dispatch(setErrors(result));
    return result == null;
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
          loading={!canLogin}
          onPress={onLoginButtonPress}
        />
        <Button
          title="Register"
          icon={{type: 'font-awesome', name: 'user-plus'}}
          containerStyle={styles.registerButton}
          disabled={!canLogin}
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
};

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
