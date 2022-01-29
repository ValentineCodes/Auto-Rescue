import React, {useState, useEffect} from 'react';
import {View, Text, BackHandler} from 'react-native';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

import {styles} from '../styles/reportInfo';

export default ({navigation, route}) => {
  let {id} = route.params;

  const [moreInfo, setMoreInfo] = useState({
    description: '',
  });

  const goBack = () => {
    navigation.pop();
  };

  let backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    goBack();
    return true;
  });

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('reports')
      .doc(id)
      .onSnapshot(snapshot => {
        let info = snapshot.data().moreInfo;
        setMoreInfo(info);
      });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-back-outline"
          type="ionicon"
          size={25}
          onPress={goBack}
        />
        <Text style={styles.headerTitle}>Crime Description</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>{moreInfo.description}</Text>
    </View>
  );
};
