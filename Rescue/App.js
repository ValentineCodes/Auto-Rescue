import React, {useEffect, useState} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import RNBootSplash from 'react-native-bootsplash';
import uuid from 'react-native-uuid';

//Screens
import Home from './src/screens/Home';
import Registration from './src/screens/Registration';
import Notifications from './src/screens/Notifications';
import MoreInfo from './src/screens/MoreInfo';

import {Colors} from './src/constants/colors';

const Stack = createNativeStackNavigator();

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const dispatch = useDispatch();

  useEffect(async () => {
    RNBootSplash.hide({fade: true});
    changeNavigationBarColor('transparent', true);
    const userId = await AsyncStorage.getItem('user_ID');

    if (!userId) {
      setIsRegistering(true);
    } else {
      // Listen for notifications

      // Private notifications
      const subscriberPrivate = firestore()
        .collection('notifications')
        .doc(userId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          const notifications = snapshot.docs.map(notification => {
            return {id: uuid.v4(), ...notification.data()};
          });

          dispatch({
            type: 'addPrivateNotifications',
            payload: notifications,
          });
        });

      // Public notifications
      const subscriberPublic = firestore()
        .collection('notifications')
        .doc('broadcast')
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          const notifications = snapshot.docs.map(notification => {
            return {id: uuid.v4(), ...notification.data()};
          });

          dispatch({
            type: 'addBroadcastNotifications',
            payload: notifications,
          });
        });
      // });
    }
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar backgroundColor="rgba(0,8,51,0.8)" barStyle="dark-content" />
        {/* <Home /> */}
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MoreInfo"
            component={MoreInfo}
            options={{headerShown: false}}
          />
        </Stack.Navigator>

        {/* Registration */}
        {isRegistering ? <Registration closePopUp={setIsRegistering} /> : null}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.primary},
});

export default App;
