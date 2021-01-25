import {Button, Input, Text} from 'react-native-elements';
import React, {useEffect} from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {
  clearErrors,
  createReview,
  getReviewByRestaurantId,
  setErrors,
} from '../ReviewSlice';
import {useDispatch, useSelector} from 'react-redux';
import {validateComment, validateRating} from '../../../validations/review';

import ErrorView from '../../components/ErrorView';
import Line from '../../home/components/Line';
import StarRating from '../../home/components/StarRating';
import {getAllRestaurants} from '../../home/RestaurantsSlice';
import {getRestaurantDetails} from '../../home/RestaurantDetailsSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {useState} from 'react';
import {validateAll} from '../../../validations/validation';

export default ({restaurant, style}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      await dispatch(getReviewByRestaurantId({restaurantId: restaurant.id}));
    };
    getData();
  }, [dispatch, restaurant]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const reviews = useSelector((state) => state.reviews);
  const errors = reviews.errors;

  const loading = reviews.status === 'loading';

  const alreadyReviewed = reviews.data !== null;

  const onSubmitButtonPress = async () => {
    if (!(await validate())) return;
    try {
      const createReviewAction = await dispatch(
        createReview({restaurantId: restaurant.id, stars: rating, comment}),
      );
      unwrapResult(createReviewAction);
      ToastAndroid.show('Review submitted.', ToastAndroid.LONG);

      dispatch(getAllRestaurants());
      dispatch(getRestaurantDetails(restaurant.id));
    } catch {}
  };

  const validate = async () => {
    const result = validateAll([
      [validateRating, rating],
      [validateComment, comment],
    ]);
    await dispatch(setErrors(result));
    return result == null;
  };

  return (
    <View style={[styles.container, style]}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <Text style={styles.title}>Your Review</Text>
      <Line />
      <StarRating
        disabled={loading || alreadyReviewed}
        rating={reviews?.data?.stars || rating}
        selectedStar={(stars) => setRating(stars)}
      />
      <Input
        label="Comment"
        multiline={true}
        value={reviews?.data?.comment}
        onChangeText={(value) => setComment(value)}
        disabled={loading || alreadyReviewed}
      />
      {!loading && !alreadyReviewed && (
        <Button
          title="Submit"
          icon={{type: 'font-awesome', name: 'paper-plane'}}
          onPress={onSubmitButtonPress}
          loading={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: '#FF9800',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
