import {Button, Input} from 'react-native-elements';
import React, {useEffect, useState} from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {
  clearErrors,
  deleteUser,
  getAllUsers,
  setErrors,
  updateUser,
} from './UsersSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
  validatePassword,
} from '../../validations/user';

import ErrorView from '../components/ErrorView';
import {ScrollView} from 'react-native-gesture-handler';
import {unwrapResult} from '@reduxjs/toolkit';
import {validateAll} from '../../validations/validation';

export default ({route, navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const user = route.params.user;

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
  }, [setFirstName, setLastName, user]);

  const dispatch = useDispatch();

  const users = useSelector((state) => state.users);
  const status = users.status;
  const errors = users.errors;

  const onUpdateButtonPress = async () => {
    if (!(await validate())) return;
    try {
      const action = await dispatch(
        updateUser({
          id: user.id,
          firstName,
          lastName,
          password: password || null,
        }),
      );
      const result = unwrapResult(action);
      if (!result.errors) {
        ToastAndroid.show('User saved', ToastAndroid.LONG);
        dispatch(getAllUsers());
        navigation.goBack();
      }
    } catch (error) {}
  };

  const validate = async () => {
    let rules = [
      [validateFirstName, firstName],
      [validateLastName, lastName],
    ];
    if (password || confirmPassword) {
      rules.push([validatePassword, password]);
      rules.push([validateConfirmPassword, {password, confirmPassword}]);
    }
    const result = validateAll(rules);
    await dispatch(setErrors(result));
    return result == null;
  };

  const onDeleteButtonPress = async () => {
    try {
      const action = await dispatch(deleteUser({id: user.id}));
      const result = unwrapResult(action);
      if (!result.errors) {
        ToastAndroid.show('User deleted', ToastAndroid.LONG);
        dispatch(getAllUsers());
        navigation.goBack();
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <ScrollView showsVerticalScrollIndicator={false}>
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
          value={firstName}
          leftIcon={{type: 'font-awesome', name: 'info-circle'}}
          onChangeText={(value) => setFirstName(value)}
        />
        <Input
          label="Last Name"
          value={lastName}
          leftIcon={{type: 'font-awesome', name: 'info-circle'}}
          onChangeText={(value) => setLastName(value)}
        />
        <Button
          title="Update"
          icon={{type: 'font-awesome', name: 'edit'}}
          buttonStyle={styles.button}
          loading={status === 'updating'}
          onPress={onUpdateButtonPress}
        />
        <Button
          title="Delete"
          icon={{type: 'font-awesome', name: 'trash'}}
          buttonStyle={[styles.button, styles.deleteButton]}
          loading={status === 'deleting'}
          onPress={onDeleteButtonPress}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#d00',
  },
});
