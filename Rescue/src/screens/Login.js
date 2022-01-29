import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch} from 'react-redux';

import {Colors} from '../constants/colors';

import {styles} from '../styles/login';

import {_retrieveUser} from '../../api/users';

const screenWidth = Dimensions.get('screen').width;

export default function Login({onLogin}) {
  const [email, setEmail] = useState('');
  const [NIN, setNIN] = useState('');

  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch();

  const goToHome = user => {
    onLogin.hideLoginForm();
    onLogin.hideRegForm(user);

    setIsLogin(false);
  };

  const handleErr = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
    setIsLogin(false);
  };

  const login = () => {
    setIsLogin(true);
    _retrieveUser({NIN}, goToHome, handleErr);
    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity onPress={null} activeOpacity={1} style={styles.container}>
      <Text style={styles.headerTitle}>Welcome Back!</Text>
      <Text style={styles.headerInfo}>Retrieve your profile</Text>

      {/* Email */}
      {/* <View style={styles.fieldContainer}>
        <View style={styles.inputFieldContainer}>
          <Icon
            name="mail-outline"
            type="ionicon"
            color={Colors.secondary}
            size={screenWidth / 20}
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            maxLength={100}
            onChangeText={val => setEmail(val.trim())}
            value={email}
            style={styles.inputField}
            returnKeyType="go"
            onSubmitEditing={login}
            selectTextOnFocus
          />
        </View>
      </View> */}

      {/* NIN */}
      <View style={styles.fieldContainer}>
        <View style={styles.inputFieldContainer}>
          <Icon
            name="person-outline"
            type="ionicon"
            color="black"
            size={screenWidth / 20}
          />

          <TextInput
            placeholder="National Identification Number(NIN)"
            placeholderTextColor="#aaa"
            maxLength={11}
            onChangeText={val => setNIN(val.trim())}
            value={NIN}
            style={styles.inputField}
            returnKeyType="go"
            onSubmitEditing={login}
            keyboardType="numeric"
            selectTextOnFocus
          />
        </View>
      </View>

      {/* Login Button */}
      {isLogin ? (
        <ActivityIndicator
          color={Colors.secondary}
          size="small"
          style={{marginTop: 15}}
        />
      ) : (
        <TouchableOpacity
          onPress={NIN.trim().length == 11 ? login : null}
          activeOpacity={0.5}>
          <Text
            style={{
              ...styles.login,
              color: NIN.trim().length == 11 ? '#5c5' : 'grey',
            }}>
            Retrieve
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
