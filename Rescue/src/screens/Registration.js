import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  Keyboard,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import {Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch} from 'react-redux';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
// import firestore from '@react-native-firebase/firestore';

import {_validateEmail, _validateNIN, _addUser} from '../../api/users';

import {Colors} from '../constants/colors';

import {styles} from '../styles/registration';

import Login from './Login';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function Registration({closePopUp}) {
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');
  const [NIN, setNIN] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  const [isNameValid, setIsNameValid] = useState(false);
  const [isNINValid, setIsNINValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNumberValid, setIsNumberValid] = useState(false);

  const [nameErrMsg, setNameErrMsg] = useState('');
  const [NINErrMsg, setNINErrMsg] = useState('');
  const [addressErrMsg, setAddressErrMsg] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [numberErrMsg, setNumberErrMsg] = useState('');

  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [isValidatingNIN, setIsValidatingNIN] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSelectingProfileImage, setIsSelectingProfileImage] = useState(false);
  // const [isLoginUp, setIsLoginUp] = useState(false);

  const containerPosition = useSharedValue(screenHeight - 80);
  const imgPickerPos = useSharedValue(screenHeight);
  const loginContainerPos = useSharedValue(screenHeight);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: containerPosition.value}],
    };
  });

  const animatedImagePickerContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: imgPickerPos.value}],
    };
  });

  const animatedLoginContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: loginContainerPos.value}],
    };
  });

  const showRegForm = () => {
    containerPosition.value = withSpring(screenHeight / 6, {
      damping: 6,
      stiffness: 10,
    });
  };

  const hideRegForm = user => {
    containerPosition.value = withTiming(screenHeight - 100, {
      duration: 500,
    });

    dispatch({
      type: 'addProfile',
      payload: {
        img: user.img,
        name: user.name,
        address: user.address,
        email: user.email,
        number: user.number,
      },
    });

    setTimeout(closePopUp, 400);

    return true;
  };

  const showLoginForm = () => {
    loginContainerPos.value = withTiming(0, {
      duration: 500,
    });

    Keyboard.dismiss();
  };

  const hideLoginForm = () => {
    loginContainerPos.value = withTiming(screenHeight, {
      duration: 500,
    });

    Keyboard.dismiss();
  };

  const showImagePickerContainer = () => {
    imgPickerPos.value = withTiming(0, {
      duration: 200,
    });

    setIsSelectingProfileImage(true);
    Keyboard.dismiss();
  };

  const hideImagePickerContainer = () => {
    imgPickerPos.value = withTiming(screenHeight, {
      duration: 200,
    });

    setIsSelectingProfileImage(false);
  };

  const useCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Alert App',
          message: 'Alert needs access to your camera',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openCamera({
          width: 500,
          height: 500,
          cropping: true,
          mediaType: 'photo',
        })
          .then(image => {
            if (
              image.mime === 'image/jpeg' ||
              image.mime === 'image/png' ||
              image.mime === 'image/gif'
            ) {
              setProfileImage({
                uri: image.path,
                filename: image.path.substr(image.path.lastIndexOf('/') + 1),
              });
              hideImagePickerContainer();
            } else {
              alert('This is not an image. Select an image');
            }
          })
          .catch(err => {
            return;
          });
      } else {
        return;
      }
    } catch (err) {
      return;
    }
  };

  const selectImageFromLibrary = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        if (
          image.mime === 'image/jpeg' ||
          image.mime === 'image/png' ||
          image.mime === 'image/gif'
        ) {
          setProfileImage({
            uri: image.path,
            filename: image.path.substr(image.path.lastIndexOf('/') + 1),
          });
          hideImagePickerContainer();
        } else {
          alert('This is not an image. Select an image');
        }
      })
      .catch(err => {
        return;
      });
  };

  const addName = name => {
    setName(name);
    if (name.trim() && name.match(/^[a-z ,.'-]+$/i)) {
      setIsNameValid(true);
      setNameErrMsg('');
    } else {
      setIsNameValid(false);
    }
  };

  const addNIN = nin => {
    setNIN(nin);
    if (nin.trim() && nin.length === 13 && nin.match(/^[0-9]*$/)) {
      setIsValidatingNIN(true);
      _validateNIN(
        nin,
        {setIsNINValid, setNINErrMsg, setIsValidatingNIN},
        handleErr,
      );
    } else {
      setIsNINValid(false);
    }
  };

  const addAddress = address => {
    setAddress(address);
    if (address.trim()) {
      setIsAddressValid(true);
      setAddressErrMsg('');
    } else {
      setIsAddressValid(false);
    }
  };

  const addEmail = email => {
    setEmail(email);
    if (
      email.trim() &&
      email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      setIsValidatingEmail(true);
      _validateEmail(
        email,
        {
          setIsEmailValid,
          setEmailErrMsg,
          setIsValidatingEmail,
        },
        handleErr,
      );
    } else {
      setIsEmailValid(false);
    }
  };

  const addNumber = num => {
    setNumber(num.trim());
    if (
      num.trim().length >= 10 &&
      num.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)
    ) {
      setIsNumberValid(true);
      setNumberErrMsg('');
    } else {
      setIsNumberValid(false);
    }
  };

  const validateName = () => {
    if (name.trim() && name.match(/^[a-z ,.'-]+$/i)) {
      setNameErrMsg('');
    } else {
      setIsNameValid(false);
      if (!name.trim()) {
        setNameErrMsg('Name is required');
      } else {
        setNameErrMsg('Name must be letters and/or a hyphen(-).');
      }
    }
  };

  const validateNIN = () => {
    if (NIN.trim() && NIN.length === 13 && NIN.match(/^[0-9]*$/)) {
      setNINErrMsg('');
    } else {
      setIsNINValid(false);
      if (!NIN.trim()) {
        setNINErrMsg('NIN is required');
      } else {
        setNINErrMsg('Invalid NIN');
      }
    }
  };

  const validateAddress = () => {
    if (address.trim()) {
      setAddressErrMsg('');
    } else {
      setIsAddressValid(false);
      if (!address.trim()) {
        setAddressErrMsg('Address is required');
      }
    }
  };

  const validateEmail = () => {
    if (
      email.trim() &&
      email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      setEmailErrMsg('');
    } else {
      setIsEmailValid(false);
      if (!email.trim()) {
        setEmailErrMsg('Email is required');
      } else {
        setEmailErrMsg('Invalid Email');
      }
    }
  };

  const validateNumber = () => {
    if (
      number.trim().length >= 10 &&
      number.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)
    ) {
      setNumberErrMsg('');
    } else {
      setIsNumberValid(false);
      if (!number.trim()) {
        setNumberErrMsg('Phone Number is required');
      } else {
        setNumberErrMsg('Invalid Phone Number.');
      }
    }
  };

  const handleErr = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
    setIsCreating(false);
  };

  const createProfile = async () => {
    setIsCreating(true);

    if (!profileImage) {
      // Add user to database
      _addUser(
        {
          img: '',
          name,
          address,
          email,
          NIN,
          number,
        },
        hideRegForm,
        setIsCreating,
        handleErr,
      );
    } else {
      // Upload profile image to cloud storage
      let imgId = uuid.v4();
      let imgExt = profileImage.filename.split('.').pop();
      let imgRef = `${imgId}.${imgExt}`;

      const reference = storage().ref(imgRef);

      reference.putFile(profileImage.uri).then(res => {
        // Get image url
        storage()
          .ref(imgRef)
          .getDownloadURL()
          .then(imgUrl => {
            // Add user to database
            _addUser(
              {
                img: imgUrl,
                name,
                address,
                email,
                NIN,
                number,
              },
              hideRegForm,
              setIsCreating,
              handleErr,
            );
          });
      });
    }
  };

  //Functions Below Render Components Conditionally

  const renderValidationIcons = (inputContentType, isValid) => {
    if (inputContentType) {
      if (isValid) {
        return (
          <Icon
            name="checkmark-outline"
            type="ionicon"
            color="#22cc22"
            size={screenWidth / 20}
            style={{marginRight: 10}}
          />
        );
      } else {
        return (
          <Icon
            name="close-outline"
            type="ionicon"
            color="#b3001e"
            size={screenWidth / 20}
            style={{marginRight: 10}}
          />
        );
      }
    } else {
      return null;
    }
  };

  useEffect(() => {
    showRegForm();

    // firestore()
    //   .collection('users')
    //   .get()
    //   .then(res => console.log(res.docs))
    //   .catch(err => console.log('Error: ', err));

    return () => {
      cancelAnimation(containerPosition);
    };
  }, []);

  return (
    <View style={styles.overallContainer}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          style={styles.form}>
          <Text style={styles.headerTitle}>Create Profile</Text>

          <TouchableOpacity
            onPress={showLoginForm}
            activeOpacity={0.5}
            style={styles.login}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image
              source={
                !profileImage
                  ? require('../../assets/images/default_profile_pic.png')
                  : {uri: profileImage.uri}
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              onPress={showImagePickerContainer}
              style={styles.editButton}>
              <Icon
                reverse
                name="camera-outline"
                type="ionicon"
                color="#5c5"
                size={screenWidth / 28}
              />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <View style={styles.fieldContainer}>
            <View
              style={{
                ...styles.inputFieldContainer,
                borderBottomColor: nameErrMsg ? '#b3001e' : 'black',
              }}>
              <Icon
                name="person-outline"
                type="ionicon"
                color={nameErrMsg ? '#b3001e' : 'black'}
                size={screenWidth / 20}
              />

              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                maxLength={50}
                onChangeText={name => addName(name)}
                onBlur={validateName}
                value={name}
                style={styles.inputField}
                returnKeyType="go"
                onSubmitEditing={
                  isNameValid &&
                  isAddressValid &&
                  isEmailValid &&
                  isNINValid &&
                  isNumberValid
                    ? createProfile
                    : null
                }
                selectTextOnFocus
              />

              {renderValidationIcons(name, isNameValid)}
            </View>
            {nameErrMsg ? (
              <Text style={styles.errorMsg}>{nameErrMsg}</Text>
            ) : null}
          </View>

          {/* Address */}
          <View style={styles.fieldContainer}>
            <View
              style={{
                ...styles.inputFieldContainer,
                borderBottomColor: addressErrMsg ? '#b3001e' : 'black',
              }}>
              <Icon
                name="location-outline"
                type="ionicon"
                color={addressErrMsg ? '#b3001e' : 'black'}
                size={screenWidth / 20}
              />

              <TextInput
                textContentType="fullStreetAddress"
                placeholder="Home Address"
                placeholderTextColor="#aaa"
                maxLength={150}
                onChangeText={address => addAddress(address)}
                onBlur={validateAddress}
                value={address}
                style={styles.inputField}
                returnKeyType="go"
                onSubmitEditing={
                  isNameValid &&
                  isAddressValid &&
                  isEmailValid &&
                  isNINValid &&
                  isNumberValid
                    ? createProfile
                    : null
                }
                selectTextOnFocus
              />

              {renderValidationIcons(address, isAddressValid)}
            </View>
            {addressErrMsg ? (
              <Text style={styles.errorMsg}>{addressErrMsg}</Text>
            ) : null}
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <View
              style={{
                ...styles.inputFieldContainer,
                borderBottomColor: emailErrMsg ? '#b3001e' : 'black',
              }}>
              <Icon
                name="mail-outline"
                type="ionicon"
                color={emailErrMsg ? '#b3001e' : 'black'}
                size={screenWidth / 20}
              />

              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#aaa"
                maxLength={100}
                onChangeText={email => addEmail(email)}
                onBlur={validateEmail}
                value={email}
                style={styles.inputField}
                returnKeyType="go"
                onSubmitEditing={
                  isNameValid &&
                  isAddressValid &&
                  isEmailValid &&
                  isNINValid &&
                  isNumberValid
                    ? createProfile
                    : null
                }
                selectTextOnFocus
              />

              {isValidatingEmail ? (
                <ActivityIndicator color="blue" size="small" />
              ) : email ? (
                isEmailValid ? (
                  <Icon
                    name="checkmark-outline"
                    type="ionicon"
                    color="#22cc22"
                    size={screenWidth / 20}
                    style={{marginRight: 10}}
                  />
                ) : (
                  <Icon
                    name="close-outline"
                    type="ionicon"
                    color="#b3001e"
                    size={screenWidth / 20}
                    style={{marginRight: 10}}
                  />
                )
              ) : null}
            </View>
            {emailErrMsg ? (
              <Text style={styles.errorMsg}>{emailErrMsg}</Text>
            ) : null}
          </View>

          {/* NIN */}

          <View style={styles.fieldContainer}>
            <View
              style={{
                ...styles.inputFieldContainer,
                borderBottomColor: NINErrMsg ? '#b3001e' : 'black',
              }}>
              <Icon
                name="person-outline"
                type="ionicon"
                color={NINErrMsg ? '#b3001e' : 'black'}
                size={screenWidth / 20}
              />

              <TextInput
                placeholder="National Identification Number(NIN)"
                placeholderTextColor="#aaa"
                maxLength={13}
                onChangeText={nin =>
                  isValidatingNIN
                    ? ToastAndroid.show(
                        'Cannot edit value until validation is complete. Careful Next Time!',
                        ToastAndroid.LONG,
                      )
                    : addNIN(nin)
                }
                onBlur={validateNIN}
                value={NIN}
                style={styles.inputField}
                returnKeyType="go"
                onSubmitEditing={
                  isNameValid &&
                  isAddressValid &&
                  isEmailValid &&
                  isNINValid &&
                  isNumberValid
                    ? createProfile
                    : null
                }
                keyboardType="numeric"
                selectTextOnFocus
              />

              {isValidatingNIN ? (
                <ActivityIndicator color={Colors.secondary} size="small" />
              ) : NIN ? (
                isNINValid ? (
                  <Icon
                    name="checkmark-outline"
                    type="ionicon"
                    color="#22cc22"
                    size={screenWidth / 20}
                    style={{marginRight: 10}}
                  />
                ) : (
                  <Icon
                    name="close-outline"
                    type="ionicon"
                    color="#b3001e"
                    size={screenWidth / 20}
                    style={{marginRight: 10}}
                  />
                )
              ) : null}
            </View>
            {NINErrMsg ? (
              <Text style={styles.errorMsg}>{NINErrMsg}</Text>
            ) : null}
          </View>

          {/* Phone Number */}
          <View style={styles.fieldContainer}>
            <View
              style={{
                ...styles.inputFieldContainer,
                borderBottomColor: numberErrMsg ? '#b3001e' : 'black',
              }}>
              <Icon
                name="call-outline"
                type="ionicon"
                color={numberErrMsg ? '#b3001e' : 'black'}
                size={screenWidth / 20}
              />
              <TextInput
                placeholder="Phone Number/Emergency Contact"
                placeholderTextColor="#aaa"
                maxLength={15}
                onChangeText={num => addNumber(num)}
                onBlur={validateNumber}
                value={number}
                style={styles.inputField}
                returnKeyType="go"
                onSubmitEditing={
                  isNameValid &&
                  isAddressValid &&
                  isEmailValid &&
                  isNINValid &&
                  isNumberValid
                    ? createProfile
                    : null
                }
                keyboardType="number-pad"
                textContentType="telephoneNumber"
                selectTextOnFocus
              />
              {renderValidationIcons(number, isNumberValid)}
            </View>
            {numberErrMsg ? (
              <Text style={styles.errorMsg}>{numberErrMsg}</Text>
            ) : null}
          </View>

          {/* Create profile button */}
          {isCreating ? (
            <ActivityIndicator
              color={Colors.secondary}
              size="small"
              style={{marginTop: 15}}
            />
          ) : (
            <TouchableOpacity
              onPress={
                isNameValid &&
                isAddressValid &&
                isEmailValid &&
                isNINValid &&
                isNumberValid
                  ? createProfile
                  : Keyboard.dismiss
              }>
              <Text
                style={{
                  ...styles.signUp,
                  color:
                    isNameValid &&
                    isAddressValid &&
                    isEmailValid &&
                    isNINValid &&
                    isNumberValid
                      ? '#5c5'
                      : 'grey',
                }}>
                Create
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>

      {/* Components below are rendered above other components */}

      {/* Container For Selecting Profile Image */}

      <Animated.View
        style={[styles.popUpLayer, animatedImagePickerContainerStyle]}>
        <TouchableOpacity
          activeOpacity={0}
          onPress={hideImagePickerContainer}
          style={styles.imagePickerContainer}>
          {/* Take A Photo */}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={useCamera}
            style={{
              ...styles.imagePickerButton,
              paddingVertical: isSelectingProfileImage ? 20 : 0,
            }}>
            <Text style={styles.imagePickerButtonText}>Take A Photo</Text>
          </TouchableOpacity>

          {/* Choose Existing Photo */}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={selectImageFromLibrary}
            style={{
              ...styles.imagePickerButton,
              paddingVertical: isSelectingProfileImage ? 20 : 0,
            }}>
            <Text style={styles.imagePickerButtonText}>
              Choose Existing Photo
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>

      {/* Login Component */}

      <Animated.View style={[styles.popUpLayer, animatedLoginContainerStyle]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={hideLoginForm}
          style={styles.imagePickerContainer}>
          <Login onLogin={{hideRegForm, hideLoginForm}} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
