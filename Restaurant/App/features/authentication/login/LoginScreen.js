import {Button, Input, Text} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';

import React from 'react';

export default ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text h2 style={styles.loginHeader}>
          Restaurant Login
        </Text>
        <Input
          label="Username"
          leftIcon={{type: 'font-awesome', name: 'user'}}
        />
        <Input
          label="Password"
          leftIcon={{type: 'font-awesome', name: 'key'}}
        />
        <Button title="Login" icon={{type: 'font-awesome', name: 'sign-in'}} />
        <Button
          title="Register"
          icon={{type: 'font-awesome', name: 'user-plus'}}
          containerStyle={styles.registerButton}
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
    marginBottom: 15,
  },
  registerButton: {
    marginTop: 10,
  },
});
