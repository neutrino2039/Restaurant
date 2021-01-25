import {Button, CheckBox, Input} from 'react-native-elements';
import React, {useState} from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {clearErrors, createUser, getAllUsers, setErrors} from './UsersSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
  validatePassword,
  validateUserName,
} from '../../validations/user';

import ErrorView from '../components/ErrorView';
import {ROLES} from '../authentication/AuthenticationSlice';
import {ScrollView} from 'react-native-gesture-handler';
import {unwrapResult} from '@reduxjs/toolkit';
import {validateAll} from '../../validations/validation';

export default ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOwner, setOwner] = useState(false);

  const dispatch = useDispatch();

  const users = useSelector((state) => state.users);
  const status = users.status;
  const errors = users.errors;

  const onSaveButtonPress = async () => {
    if (!(await validate())) return;
    try {
      const action = await dispatch(
        createUser({
          userName,
          firstName,
          lastName,
          password,
          role: isOwner ? ROLES.OWNER : ROLES.REGULAR,
        }),
      );
      const result = unwrapResult(action);
      if (!result.errors) {
        await dispatch(getAllUsers());
        ToastAndroid.show('User saved', ToastAndroid.LONG);
        navigation.goBack();
      }
    } catch (error) {}
  };

  const validate = async () => {
    const result = validateAll([
      [validateUserName, userName],
      [validateFirstName, firstName],
      [validateLastName, lastName],
      [validatePassword, password],
      [validateConfirmPassword, {password, confirmPassword}],
    ]);
    await dispatch(setErrors(result));
    return result == null;
  };

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <CheckBox
          title="Owner"
          checked={isOwner}
          onPress={() => setOwner(!isOwner)}
          containerStyle={styles.checkBox}
        />
        <Button
          title="Save"
          icon={{type: 'font-awesome', name: 'user-plus'}}
          containerStyle={styles.button}
          loading={status === 'creating'}
          onPress={onSaveButtonPress}
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  checkBox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
    marginTop: 0,
  },
  button: {
    marginTop: 10,
  },
});
