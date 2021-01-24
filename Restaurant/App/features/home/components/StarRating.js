import {StyleSheet, View} from 'react-native';

import React from 'react';
import StarRating from 'react-native-star-rating';
import {Text} from 'react-native-elements';

export default ({rating = 0, disabled = true, selectedStar = () => {}}) => (
  <View style={styles.starContainer}>
    <StarRating
      starSize={25}
      rating={rating}
      fullStarColor="brown"
      emptyStarColor="brown"
      disabled={disabled}
      selectedStar={selectedStar}
    />
    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
  </View>
);
const styles = StyleSheet.create({
  starContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'brown',
  },
});
