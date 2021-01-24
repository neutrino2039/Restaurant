import {Button, Input} from 'react-native-elements';
import {Image, StyleSheet, ToastAndroid, View} from 'react-native';
import React, {useState} from 'react';
import {
  clearErrors,
  getAllRestaurants,
  setErrors,
  setImageName,
  updateRestaurant,
  uploadImage,
} from './RestaurantsSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  validateRestaurantAddress,
  validateRestaurantImage,
  validateRestaurantName,
} from '../../validations/restaurant';

import ErrorView from '../components/ErrorView';
import {ScrollView} from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';
import {serverImage} from '../../apis/api';
import {unwrapResult} from '@reduxjs/toolkit';
import {useEffect} from 'react';
import {validateAll} from '../../validations/validation';

export default ({route, navigation}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const restaurant = route.params.restaurant;

  useEffect(() => {
    setName(restaurant.name);
    setAddress(restaurant.address);
    setImageName(restaurant.imageName);
    dispatch(setImageName(restaurant.imageName));
  }, [setName, setAddress, restaurant, dispatch]);

  const dispatch = useDispatch();

  const restaurants = useSelector((state) => state.restaurants);
  const status = restaurants.status;
  const loading = status === 'loading';
  const errors = restaurants.errors;

  const onSaveButtonPress = async () => {
    if (!(await validate())) return;
    try {
      await dispatch(
        updateRestaurant({
          id: restaurant.id,
          name,
          address,
          imageName: restaurants.imageName,
        }),
      );
      await dispatch(getAllRestaurants());
      ToastAndroid.show('Restaurant saved', ToastAndroid.LONG);
      navigation.goBack();
    } catch (error) {}
  };

  const validate = async () => {
    const result = validateAll([
      [validateRestaurantName, name],
      [validateRestaurantAddress, address],
      [validateRestaurantImage, restaurants.imageName],
    ]);
    await dispatch(setErrors(result));
    return result == null;
  };

  return (
    <View style={styles.container}>
      <ErrorView errors={errors} onClosePress={() => dispatch(clearErrors())} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.loginBox}>
          <Input
            label="Name"
            leftIcon={{type: 'font-awesome', name: 'user'}}
            value={name}
            onChangeText={(value) => setName(value)}
          />
          <Input
            label="Address"
            leftIcon={{type: 'font-awesome', name: 'map-marker'}}
            value={address}
            onChangeText={(value) => setAddress(value)}
          />

          {restaurants.imageName && (
            <Image
              source={{uri: serverImage(restaurants.imageName)}}
              style={styles.image}
            />
          )}
          <Button
            title="Upload Image"
            icon={{type: 'font-awesome', name: 'upload'}}
            onPress={() =>
              launchImageLibrary({mediaType: 'photo'}, async (response) => {
                if (response.didCancel || response.errorCode) return;

                try {
                  const uploadImageAction = await dispatch(
                    uploadImage({
                      type: response.type,
                      name: response.fileName,
                      uri: response.uri,
                    }),
                  );
                  const result = unwrapResult(uploadImageAction);
                  setImageName(result.fileName);
                } catch {}
              })
            }
            loading={!restaurants.imageName && loading}
          />

          <Button
            title="Save"
            icon={{type: 'font-awesome', name: 'user-plus'}}
            containerStyle={styles.button}
            loading={restaurants.imageName && loading}
            onPress={onSaveButtonPress}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});
