import {StyleSheet, View} from 'react-native';

import React from 'react';

export default () => <View style={styles.line} />;

const styles = StyleSheet.create({
  line: {
    borderColor: 'brown',
    borderWidth: 1,
    marginHorizontal: 25,
    marginVertical: 8,
    alignSelf: 'stretch',
  },
});
