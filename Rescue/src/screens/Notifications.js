import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, BackHandler} from 'react-native';
import {Icon} from 'react-native-elements';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {styles} from '../styles/notifications';

import PrivateNotifications from './PrivateNotifications';
import BroadcastNotifications from './BroadcastNotifications';

const Tab = createMaterialTopTabNavigator();

// Main component
export default ({navigation}) => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.pop();

    return true;
  });

  useEffect(() => {
    return () => {
      backHandler.remove();
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navigator}
          onPress={() => navigation.pop()}>
          <Icon name="arrow-back-outline" type="ionicon" size={30} />
          <Text allowFontScaling={false} style={styles.headerText}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Tab */}

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'black',
        }}>
        <Tab.Screen name="Private" component={PrivateNotifications} />
        <Tab.Screen name="Broadcast" component={BroadcastNotifications} />
      </Tab.Navigator>
    </View>
  );
};
