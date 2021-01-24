import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';
import React, {useEffect} from 'react';
import {clearErrors, getRestaurantDetails} from './RestaurantDetailsSlice';
import {useDispatch, useSelector} from 'react-redux';

import ErrorView from '../components/ErrorView';
import ReviewCard from './components/ReviewCard';
import {ScrollView} from 'react-native-gesture-handler';
import StarRating from './components/StarRating';
import {serverImage} from '../../apis/api';

export default ({route, navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      await dispatch(getRestaurantDetails(route.params.restaurant.id));
    };
    getData();
  }, [dispatch, route]);

  const restaurantDetails = useSelector((state) => state.restaurantDetails);

  const status = restaurantDetails.status;
  const errors = restaurantDetails.errors;

  if (status === 'loading')
    return (
      <View style={styles.noDataContainer}>
        <ActivityIndicator size="large" color="darkblue" />
      </View>
    );

  if (!errors && !restaurantDetails.data)
    return (
      <View style={styles.noDataContainer}>
        <Text>No data.</Text>
        <Button
          title="Retry"
          type="clear"
          icon={{type: 'font-awesome', name: 'undo', style: [{scaleX: -1}]}}
          onPress={async () =>
            await dispatch(getRestaurantDetails(route.params.restaurant.id))
          }>
          Retry
        </Button>
      </View>
    );

  const {
    averageRating,
    highestRatedReview,
    lastReview,
    lowestRatedReview,
  } = restaurantDetails.data;

  const restaurant = route.params.restaurant;
  console.log(restaurant);

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{uri: serverImage(restaurant.imageName)}}
          style={styles.image}
        />
        <Text h3 style={styles.name}>
          {restaurant.name}
        </Text>
        <StarRating rating={averageRating} />
        <ReviewCard
          title="Highest Rated Review"
          data={highestRatedReview}
          style={styles.reviewCard}
        />
        <ReviewCard
          title="Lowest Rated Review"
          data={lowestRatedReview}
          style={styles.reviewCard}
        />
        <ReviewCard
          title="Last Review"
          data={lastReview}
          style={[styles.reviewCard, styles.lastReviewCard]}
        />
      </ScrollView>
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
    padding: 0,
  },
  image: {
    width: '100%',
    height: 200,
  },
  name: {
    alignSelf: 'center',
  },
  reviewCard: {
    margin: 10,
    marginBottom: 0,
  },
  lastReviewCard: {
    marginBottom: 10,
  },
});
