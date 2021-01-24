import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';
import React, {useEffect} from 'react';
import {clearErrors, getAllRestaurants} from './RestaurantsSlice';
import {useDispatch, useSelector} from 'react-redux';

import ErrorView from '../components/ErrorView';
import StarRating from './components/StarRating';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {logout} from '../authentication/AuthenticationSlice';
import {removeAccessToken} from '../../utilities/device';
import {serverImage} from '../../apis/api';

export default ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => await dispatch(getAllRestaurants());
    getData();
  }, [dispatch]);

  const restaurants = useSelector((state) => state.restaurants);

  const status = restaurants.status;
  const errors = restaurants.errors;

  const onLogoutButtonPress = async () => {
    await removeAccessToken();
    await dispatch(logout());
  };

  if (status === 'loading')
    return (
      <View style={styles.noDataContainer}>
        <ActivityIndicator size="large" color="darkblue" />
      </View>
    );

  if (!errors && !restaurants.data)
    return (
      <View style={styles.noDataContainer}>
        <Text>No data.</Text>
        <Button
          title="Retry"
          type="clear"
          icon={{type: 'font-awesome', name: 'undo', style: [{scaleX: -1}]}}
          onPress={async () => await dispatch(getAllRestaurants())}>
          Retry
        </Button>
      </View>
    );

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <FlatList
        data={restaurants.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Details', {restaurant: item})}>
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
            <StarRating rating={item.averageStars} />
          </TouchableOpacity>
        )}
      />
      <Button title="Logout" onPress={onLogoutButtonPress} />
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
});
