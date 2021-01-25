import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import React, {useCallback, useEffect, useState} from 'react';
import {clearErrors, getAllUsers} from './UsersSlice';
import {useDispatch, useSelector} from 'react-redux';

import ErrorView from '../components/ErrorView';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    return await dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  const users = useSelector((state) => state.users);

  const status = users.status;
  const errors = users.errors;

  console.log(users);

  if (status !== 'succeeded' && !users.data)
    return (
      <View style={styles.noDataContainer}>
        <ActivityIndicator size="large" color="darkblue" />
      </View>
    );

  if (!refreshing && !errors && !users.data)
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

      <Button
        title="Create User"
        icon={{type: 'font-awesome', name: 'plus'}}
        containerStyle={styles.createUserButton}
        onPress={() => navigation.navigate('CreateUser')}
      />

      <FlatList
        data={users.data}
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
              navigation.navigate('UpdateDeleteUser', {user: item})
            }>
            <View style={styles.name}>
              <Text>{item.firstName}</Text>
              <Text>{item.lastName}</Text>
            </View>
            <View style={styles.details}>
              <Text>User Name: {item.userName}</Text>
              <Text>Role: {item.role}</Text>
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
  createUserButton: {
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
  name: {
    flex: 1,
  },
  details: {
    alignItems: 'flex-end',
  },
});
