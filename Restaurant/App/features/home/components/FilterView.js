import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';
import React from 'react';
import StarRating from './StarRating';

export default ({
  from,
  to,
  onFromChange = () => {},
  onToChange = () => {},
  onFilterPress = () => {},
  onClearPress = () => {},
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.ratingContainer}>
        <StarRating
          disabled={false}
          rating={from}
          selectedStar={(stars) => onFromChange(stars)}
        />
        <StarRating
          disabled={false}
          rating={to}
          selectedStar={(stars) => onToChange(stars)}
        />
      </View>
      <View>
        <Button
          icon={{
            type: 'font-awesome',
            name: 'filter',
          }}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          onPress={onFilterPress}
        />
      </View>
      <View>
        <Button
          icon={{
            type: 'font-awesome',
            name: 'times-circle',
          }}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          onPress={onClearPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9800',
    alignItems: 'center',
  },
  ratingContainer: {
    flex: 1,
  },
  buttonContainer: {
    margin: 5,
  },
  button: {
    backgroundColor: '#FF9800',
    color: 'brown',
  },
});
