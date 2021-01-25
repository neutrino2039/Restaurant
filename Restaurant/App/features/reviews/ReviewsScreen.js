import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import React, {useCallback, useEffect, useState} from 'react';
import {clearErrors, getAllReviewsByRestaurantId} from './ReviewSlice';
import {useDispatch, useSelector} from 'react-redux';

import ErrorView from '../components/ErrorView';
import ReviewCard from './components/ReviewCard';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default ({route, navigation}) => {
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();

  const restaurant = route.params.restaurant;

  const getData = useCallback(async () => {
    return await dispatch(
      getAllReviewsByRestaurantId({restaurantId: restaurant.id}),
    );
  }, [dispatch, restaurant]);

  useEffect(() => {
    getData();
  }, [getData]);

  const reviews = useSelector((state) => state.reviews);
  console.log(reviews);

  const status = reviews.status;
  const errors = reviews.errors;

  if (status !== 'succeeded' && !refreshing)
    return (
      <View style={styles.noDataContainer}>
        <ActivityIndicator size="large" color="darkblue" />
      </View>
    );

  if (!refreshing && !errors && (!reviews.data || reviews.data.length <= 0))
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
        data={reviews.data}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await getData();
          setRefreshing(false);
        }}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateDeleteReview')}>
            <ReviewCard style={styles.card} title="Review" data={item} />
          </TouchableOpacity>
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
    padding: 0,
    paddingTop: 5,
  },
  createUserButton: {
    margin: 10,
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
  name: {
    flex: 1,
  },
  details: {
    alignItems: 'flex-end',
  },
});
