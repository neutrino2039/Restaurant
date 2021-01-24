import {Button, Input, Text} from 'react-native-elements';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {clearErrors, register, setErrors} from './AuthenticationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
  validatePassword,
  validateUserName,
} from '../../validations/user';

import ErrorView from '../components/ErrorView';
import {storeAccessToken} from '../../utilities/device';
import {unwrapResult} from '@reduxjs/toolkit';
import {validateAll} from '../../validations/validation';

export default ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const dispatch = useDispatch();
  const authentication = useSelector((state) => state.authentication);

  const canRegister = authentication.status !== 'loading';
  const errors = authentication.errors;

  const onRegisterButtonPress = async () => {
    if (!(await validate())) return;
    try {
      const registerAction = await dispatch(
        register({userName, password, firstName, lastName}),
      );
      const result = unwrapResult(registerAction);
      await storeAccessToken(result.token);
    } catch (error) {}
  };

  const validate = async () => {
    const result = validateAll([
      [validateUserName, userName],
      [validatePassword, password],
      [validateConfirmPassword, {password, confirmPassword}],
      [validateFirstName, firstName],
      [validateLastName, lastName],
    ]);
    await dispatch(setErrors(result));
    return result == null;
  };

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.loginBox}>
          <Text h2 style={styles.loginHeader}>
            Register User
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
          <Input
            label="Confirm Password"
            leftIcon={{type: 'font-awesome', name: 'lock'}}
            secureTextEntry={true}
            onChangeText={(value) => setConfirmPassword(value)}
          />
          <Input
            label="First Name"
            leftIcon={{type: 'font-awesome', name: 'info-circle'}}
            onChangeText={(value) => setFirstName(value)}
          />
          <Input
            label="Last Name"
            leftIcon={{type: 'font-awesome', name: 'info-circle'}}
            onChangeText={(value) => setLastName(value)}
          />
          <Button
            title="Register"
            icon={{type: 'font-awesome', name: 'user-plus'}}
            containerStyle={styles.registerButton}
            loading={!canRegister}
            onPress={onRegisterButtonPress}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
