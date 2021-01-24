import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';
import React, {useCallback, useEffect, useState} from 'react';
import {
  clearErrors,
  clearFilter,
  getAllRestaurants,
  setFilter,
} from './RestaurantsSlice';
import {useDispatch, useSelector} from 'react-redux';

import ErrorView from '../components/ErrorView';
import FilterView from './components/FilterView';
import {ROLES} from '../authentication/AuthenticationSlice';
import StarRating from './components/StarRating';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {serverImage} from '../../apis/api';

export default ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [starsFrom, setFilterFrom] = useState(0);
  const [starsTo, setStarsTo] = useState(0);

  const dispatch = useDispatch();
  const authentication = useSelector((state) => state.authentication);
  const role = authentication.role;

  const getData = useCallback(async () => {
    return await dispatch(getAllRestaurants());
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  const restaurants = useSelector((state) => state.restaurants);

  const status = restaurants.status;
  const errors = restaurants.errors;

  if (status === 'loading' && !refreshing)
    return (
      <View style={styles.noDataContainer}>
        <ActivityIndicator size="large" color="darkblue" />
      </View>
    );

  if (!refreshing && !errors && !restaurants.data)
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

      <FilterView
        style={styles.filterView}
        from={starsFrom}
        to={starsTo}
        onFromChange={(stars) => setFilterFrom(stars)}
        onToChange={(stars) => setStarsTo(stars)}
        onClearPress={async () => {
          setFilterFrom(0);
          setStarsTo(0);
          await dispatch(clearFilter());
          await getData();
        }}
        onFilterPress={async () => {
          await dispatch(setFilter({starsFrom, starsTo}));
          await getData();
        }}
      />

      {role === ROLES.OWNER && (
        <Button
          title="Create Restaurant"
          icon={{type: 'font-awesome', name: 'plus'}}
          containerStyle={styles.createRestaurantButton}
          onPress={() => navigation.navigate('CreateRestaurant')}
        />
      )}

      <FlatList
        data={restaurants.data}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await getData();
          setRefreshing(false);
        }}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                role === ROLES.ADMIN ? 'UpdateRestaurant' : 'Details',
                {restaurant: item},
              )
            }>
            <View style={styles.restaurantDetails}>
              <Image
                source={{uri: serverImage(item.imageName)}}
                style={styles.image}
              />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text>{item.address}</Text>
              </View>
            </View>
            <View>
              <StarRating rating={item.averageStars} />
              {role === ROLES.OWNER && (
                <>
                  <Text style={styles.pendingReplies}>
                    {`${item.pendingReplies} replie(s) pending`}
                  </Text>
                </>
              )}
            </View>
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
  filterView: {
    margin: 10,
  },
  createRestaurantButton: {
    margin: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FF9800',
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
    marginVertical: 5,
  },
  restaurantDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  starContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'brown',
  },
  pendingReplies: {
    alignSelf: 'flex-end',
  },
});
