import {StyleSheet, View} from 'react-native';

import Line from '../../home/components/Line';
import React from 'react';
import StarRating from '../../home/components/StarRating';
import {Text} from 'react-native-elements';
import {relativeTime} from '../../../utilities/device';

export default ({title, data, style}) => {
  if (!data) return null;

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.title}>{data.userName}</Text>
      <StarRating rating={data.stars} />
      <Line />
      <View style={styles.comment}>
        <Text style={styles.text}>{data.comment}</Text>
        <Text style={styles.time}>({relativeTime(data.visitDate)})</Text>
      </View>
      {data.reply && (
        <>
          <Line />
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
