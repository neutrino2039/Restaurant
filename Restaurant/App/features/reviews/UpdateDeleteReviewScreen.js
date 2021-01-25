import {Button, Input} from 'react-native-elements';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {
  clearErrors,
  deleteReview,
  getAllReviewsByRestaurantId,
  setErrors,
  updateReview,
} from './ReviewSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  validateComment,
  validateRating,
  validateReply,
} from '../../validations/review';

import ErrorView from '../components/ErrorView';
import {ScrollView} from 'react-native-gesture-handler';
import StarRating from '../home/components/StarRating';
import {confirmDelete} from '../../utilities/device';
import {getAllRestaurants} from '../home/RestaurantsSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {validateAll} from '../../validations/validation';

export default ({route, navigation}) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState('');

  const review = route.params.review;

  useEffect(() => {
    setStars(review.stars);
    setComment(review.comment);
    setReply(review.reply);
  }, [setStars, setComment, setReply, review]);

  const dispatch = useDispatch();

  const reviews = useSelector((state) => state.reviews);
  const status = reviews.status;
  const errors = reviews.errors;

  const onUpdateButtonPress = async () => {
    if (!(await validate())) return;
    try {
      const action = await dispatch(
        updateReview({
          id: review.id,
          stars,
          reply,
          comment,
        }),
      );
      const result = unwrapResult(action);
      if (!result.errors) {
        await dispatch(
          getAllReviewsByRestaurantId({restaurantId: review.restaurantId}),
        );
        ToastAndroid.show('Review updated', ToastAndroid.LONG);
        dispatch(getAllRestaurants());
        navigation.goBack();
      }
    } catch (error) {}
  };

  const validate = async () => {
    let rules = [
      [validateRating, stars],
      [validateComment, comment],
    ];
    if (reply) rules.push([validateReply, reply]);
    const result = validateAll(rules);
    await dispatch(setErrors(result));
    return result == null;
  };

  const onDeleteButtonPress = async () => {
    confirmDelete({
      title: 'Delete Review',
      message: 'Do you want to delete this review?',
      onYesPress: async () => {
        try {
          const action = await dispatch(deleteReview({id: review.id}));
          const result = unwrapResult(action);
          if (!result.errors) {
            await dispatch(
              getAllReviewsByRestaurantId({restaurantId: review.restaurantId}),
            );
            ToastAndroid.show('Review deleted', ToastAndroid.LONG);
            dispatch(getAllRestaurants());
            navigation.goBack();
          }
        } catch (error) {}
      },
    });
  };

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{review.userName}</Text>
        <StarRating
          disabled={false}
          rating={stars}
          selectedStar={(value) => setStars(value)}
        />
        <Input
          label="Comment"
          value={comment}
          multiline={true}
          leftIcon={{type: 'font-awesome', name: 'comment'}}
          onChangeText={(value) => setComment(value)}
        />
        <Input
          label="Reply"
          value={reply}
          multiline={true}
          leftIcon={{type: 'font-awesome', name: 'reply'}}
          onChangeText={(value) => setReply(value || '')}
        />
        <Button
          title="Update"
          icon={{type: 'font-awesome', name: 'edit'}}
          buttonStyle={styles.button}
          loading={status === 'updating'}
          onPress={onUpdateButtonPress}
        />
        <Button
          title="Delete"
          icon={{type: 'font-awesome', name: 'trash'}}
          buttonStyle={[styles.button, styles.deleteButton]}
          loading={status === 'deleting'}
          onPress={onDeleteButtonPress}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#d00',
  },
});
