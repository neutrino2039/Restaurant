import {Button, Card, Overlay, Text} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';

import React from 'react';

export default ({errors, onClosePress = () => {}}) => {
  return (
    <Overlay
      overlayStyle={styles.overlay}
      isVisible={errors !== null}
      onBackdropPress={onClosePress}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Error</Card.Title>
        <Card.Divider />
        {typeof errors === 'string' ? (
          <ErrorStringView errors={errors} />
        ) : (
          <ErrorObjectView errors={errors} />
        )}
        <Button
          title="Close"
          containerStyle={styles.button}
          onPress={onClosePress}
        />
      </Card>
    </Overlay>
  );
};

const ErrorStringView = ({errors}) => {
  return (
    <View style={styles.errorDetails}>
      <Text style={styles.errorTitle}>{errors}</Text>
    </View>
  );
};

const ErrorObjectView = ({errors}) => {
  if (!errors) return null;
  return (
    <View>
      {Object.keys(errors).map((key, index) => ErrorDetails(key, errors[key]))}
    </View>
  );
};

const ErrorDetails = (errorTitle, error) => (
  <View style={styles.errorDetails} key={errorTitle}>
    <Text style={styles.errorTitle}>{errorTitle}</Text>
    {error.map((e, index) => {
      return (
        <View key={index} style={styles.errorTextContainer}>
          <Text style={styles.errorTextBullet}>❍</Text>
          <Text testID="error">{e}</Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    borderRadius: 15,
    padding: 0,
    margin: 25,
  },
  card: {
    minWidth: 200,
    margin: 0,
    padding: 20,
    borderRadius: 15,
  },
  cardTitle: {
    color: '#ed4337',
    fontSize: 20,
  },
  errorDetails: {
    paddingBottom: 15,
  },
  errorTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    paddingBottom: 5,
  },
  errorTitle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  errorTextBullet: {
    marginRight: 10,
  },
  button: {},
});
