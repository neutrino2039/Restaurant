import {ActivityIndicator, StyleSheet, ToastAndroid, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import React, {useCallback, useEffect, useState} from 'react';
import {
  clearErrors,
  getReviewsPendingReply,
  replyToReview,
  setErrors,
} from './PendingReviewsSlice';
import {useDispatch, useSelector} from 'react-redux';

import ErrorView from '../components/ErrorView';
import {FlatList} from 'react-native-gesture-handler';
import Line from '../home/components/Line';
import StarRating from '../home/components/StarRating';
import {getAllRestaurants} from '../home/RestaurantsSlice';
import {relativeTime} from '../../utilities/device';
import {unwrapResult} from '@reduxjs/toolkit';
import {validateAll} from '../../validations/validation';
import {validateReply} from '../../validations/review';

export default ({route, navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [reply, setReply] = useState('');

  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    console.log(route.params.restaurant.id);
    await dispatch(getReviewsPendingReply(route.params.restaurant.id));
  }, [dispatch, route]);

  useEffect(() => {
    getData();
  }, [getData]);

  const pendingReviews = useSelector((state) => state.pendingReviews);
  const status = pendingReviews.status;
  const loading = status === 'loading';
  const errors = pendingReviews.errors;

  console.log(pendingReviews);

  const onSubmitButtonPress = async (review) => {
    console.log(review);
    if (!(await validate())) return;
    try {
      const replyToReviewAction = await dispatch(
        replyToReview({id: review.id, reply}),
      );
      unwrapResult(replyToReviewAction);
      ToastAndroid.show('Reply submitted.', ToastAndroid.LONG);
      await dispatch(getAllRestaurants());
      await getData();
    } catch {}
  };

  const validate = async () => {
    const result = validateAll([[validateReply, reply]]);
    console.log(result);
    await dispatch(setErrors(result));
    return result == null;
  };

  if (status === 'loading')
    return (
      <View style={styles.noDataContainer}>
        <ActivityIndicator size="large" color="darkblue" />
      </View>
    );

  if (
    !errors &&
    (!pendingReviews.data || pendingReviews.data.reviews.length === 0)
  )
    return (
      <View style={styles.noDataContainer}>
        <Text>No data.</Text>
        <Button
          title="Retry"
          type="clear"
          icon={{type: 'font-awesome', name: 'undo', style: [{scaleX: -1}]}}
          onPress={async () => await getData()}>
          Retry
        </Button>
      </View>
    );

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <FlatList
        data={pendingReviews.data.reviews}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await getData();
          setRefreshing(false);
        }}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.title}>Review</Text>
            <Line />

            <StarRating rating={item.stars} />

            <View style={styles.comment}>
              <Text style={styles.text}>{item.comment}</Text>
              <Text style={styles.time}>({relativeTime(item.visitDate)})</Text>
            </View>

            <Input
              label="Reply"
              multiline={true}
              onChangeText={(value) => setReply(value)}
            />

            <Button
              title="Submit"
              icon={{type: 'font-awesome', name: 'paper-plane'}}
              onPress={async () => await onSubmitButtonPress(item)}
              loading={loading}
              containerStyle={styles.button}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderColor: '#FF9800',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    marginBottom: 0,
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
  time: {
    color: '#555',
  },
  button: {
    marginTop: 10,
  },
});
