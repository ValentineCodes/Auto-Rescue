import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Keyboard,
  ToastAndroid,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useSelector} from 'react-redux';

import {_addMoreInfo} from '../../api/reports';

import {styles} from '../styles/moreInfo';

export default ({navigation}) => {
  const reportId = useSelector(state => state.reportId);

  const [description, setDescription] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);

  const goBack = () => {
    navigation.pop();
  };

  const displayMsg = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };

  const send = () => {
    if (description) {
      // Add info to firestore\
      _addMoreInfo(
        reportId,
        {
          description,
        },
        {
          setIsUpdating,
          displayMsg,
        },
      );
    } else Keyboard.dismiss();
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    goBack();
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
        <View style={styles.headerLeft}>
          <Icon
            name="arrow-back-outline"
            type="ionicon"
            size={40}
            onPress={goBack}
          />
          <View>
            <Text style={styles.headerTitle}>Report Was Sent Successfully</Text>
            <Text style={styles.headerCaption}>Any Additional Info?</Text>
          </View>
        </View>

        {isUpdating ? (
          <ActivityIndicator color="blue" size="large" />
        ) : (
          <Icon
            name="paper-plane-outline"
            type="ionicon"
            color="#5c5"
            size={30}
            onPress={send}
          />
        )}
      </View>
      <Text style={styles.inputTitle}>Crime Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.inputField}
        returnKeyType="go"
        selectTextOnFocus
        multiline
        autoFocus
      />
    </View>
  );
};
