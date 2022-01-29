import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Icon} from 'react-native-elements';

import {styles} from '../styles/header';

export default function Header({showProfile, goToNotifications}) {
  const profile = useSelector(state => state.profile);
  return (
    <View style={styles.container}>
      <View>
        <Text allowFontScaling={false} style={styles.logo}>
          RESCUE
        </Text>
        <Text allowFontScaling={false} style={styles.caption}>
          Emergencies Only!
        </Text>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* Notifications */}
        <TouchableOpacity onPress={goToNotifications}>
          <Icon
            name="notifications-outline"
            type="ionicon"
            color="rgba(0,0,0,0.8)"
            iconStyle={{marginRight: 30}}
          />
        </TouchableOpacity>
        {/* Profile */}
        <TouchableOpacity
          onPress={showProfile}
          style={styles.profilePicContainer}>
          <Image
            source={
              !profile.img
                ? require('../../assets/images/default_profile_pic.png')
                : {uri: profile.img}
            }
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
