import React from 'react';
import {View, Text, Flatlist, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {formatDistance} from 'date-fns';

import {styles} from '../styles/notifications';

export default () => {
  const notifications = useSelector(state => state.notifications['private']);

  const renderNotification = item => {
    const date = new Date(item.timestamp.seconds * 1000);

    const timestamp = formatDistance(date, new Date(), {addSuffix: true});
    return (
      <View key={item.id} style={styles.msgContainer}>
        <Text style={styles.msg}>{item.msg}</Text>
        <Text>{timestamp}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={{flex: 1}}>
      {notifications.map(renderNotification)}
    </ScrollView>
  );
};
