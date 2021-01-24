import {StyleSheet, View} from 'react-native';

import Moment from 'moment';
import React from 'react';
import StarRating from './StarRating';
import {Text} from 'react-native-elements';

const relativeTime = (dateTime) => {
  return Moment.utc(dateTime).fromNow();
};

export default ({title, data, style}) => {
  if (!data) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <StarRating rating={data.stars} />
      <View style={styles.line} />
      <View style={styles.comment}>
        <Text style={styles.text}>{data.comment}</Text>
        <Text style={styles.time}>({relativeTime(data.visitDate)})</Text>
      </View>
      {data.reply && (
        <>
          <View style={styles.line} />
          <View style={styles.reply}>
            <Text>REPLY</Text>
            <Text style={styles.text}>{data.reply}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  line: {
    borderColor: 'brown',
    borderWidth: 1,
    marginHorizontal: 25,
    marginVertical: 8,
  },
  comment: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  reply: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {},
  time: {
    color: '#555',
  },
});
