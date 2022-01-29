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
} from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import {Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';

import {_validateEmail, _updateUser} from '../../api/users';

import {Colors} from '../constants/colors';

import {styles} from '../styles/profile';

const screenWidth = Dimensions.get('screen').width;
// const screenHeight = Dimensions.get('screen').height;

export default function Profile({onRender, notVisible}) {
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState(profile.img);
  const [name, setName] = useState(profile.name);
  const [address, setAddress] = useState(profile.address);
  const [email, setEmail] = useState(profile.email);
  const [number, setNumber] = useState(profile.number);

  const [isNameValid, setIsNameValid] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isNumberValid, setIsNumberValid] = useState(true);

  const [nameErrMsg, setNameErrMsg] = useState('');
  const [addressErrMsg, setAddressErrMsg] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [numberErrMsg, setNumberErrMsg] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSelectingProfileImage, setIsSelectingProfileImage] = useState(false);

  const imagePickerContainerHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedProfileStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      display: opacity.value > 0 ? 'flex' : 'none',
    };
  });

  const animatedImagePickerContainerStyle = useAnimatedStyle(() => {
    return {
      height: `${imagePickerContainerHeight.value}%`,
    };
  });

  const showProfile = uID => {
    opacity.value = withTiming(1, {
      duration: 200,
    });
  };

  const hideProfile = () => {
    opacity.value = withTiming(0, {
      duration: 200,
    });

    notVisible();
  };

  const showImagePickerContainer = () => {
    imagePickerContainerHeight.value = withTiming(100, {
      duration: 200,
    });

    setIsSelectingProfileImage(true);
    Keyboard.dismiss();
  };

  const hideImagePickerContainer = () => {
    imagePickerContainerHeight.value = withTiming(0, {
      duration: 200,
    });

    setIsSelectingProfileImage(false);
  };

  async function useCamera() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Report App',
          message: 'Report needs access to your camera',
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
              setProfileImage(image.path);
              setIsEditing(true);
              hideImagePickerContainer();
            } else alert('This is not an image. Select an image');
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
  }

  function selectImageFromLibrary() {
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
          setProfileImage(image.path);
          setIsEditing(true);
          hideImagePickerContainer();
        } else {
          alert('This is not an image. Select an image');
        }
      })
      .catch(err => {
        return;
      });
  }

  function addName(name) {
    setName(name);
    if (name.trim() && name.match(/^[a-z ,.'-]+$/i)) {
      setIsNameValid(true);
      setNameErrMsg('');
    } else {
      setIsNameValid(false);
    }
  }

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
      // Ensuring that email is not validated if they input the same email
      if (email.trim() !== profile.email.trim()) {
        setIsValidatingEmail(true);

        _validateEmail(email, {
          setIsEmailValid,
          setEmailErrMsg,
          setIsValidatingEmail,
        });
      }
    } else {
      setIsEmailValid(false);
    }
  };

  function addNumber(num) {
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
  }

  function validateName() {
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
  }

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

  function validateNumber() {
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
  }

  const handleErr = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
    setIsUpdating(false);
    setIsEditing(true);
  };

  const displayMsg = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };

  function updateProfile() {
    setIsUpdating(true);
    setIsEditing(false);
    Keyboard.dismiss();

    if (profileImage == '' || profileImage.slice(0, 4) === 'http') {
      _updateUser(
        {
          img: profileImage,
          name,
          address,
          email,
          number,
        },
        {
          displayMsg,
          setIsUpdating,
          setIsEditing,
          dispatch,
        },
        handleErr,
      );
    } else {
      // Upload profile image to cloud storage
      let imgId = uuid.v4();
      let imgName = profileImage.substr(profileImage.lastIndexOf('/') + 1);

      let imgExt = imgName.split('.').pop();
      let imgRef = `${imgId}.${imgExt}`;

      const reference = storage().ref(imgRef);

      reference.putFile(profileImage).then(res => {
        // Get image url
        storage()
          .ref(imgRef)
          .getDownloadURL()
          .then(imgUrl => {
            _updateUser(
              {
                img: imgUrl,
                name,
                address,
                email,
                number,
              },
              {
                displayMsg,
                setIsUpdating,
                setIsEditing,
                dispatch,
              },
              handleErr,
            );
          })
          .catch(err => handleErr('Something went wrong!. Please try again'));
      });
    }
  }

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

  const renderUpdateButton = () => {
    if (isEditing) {
      return (
        <Icon
          reverse
          disabled={
            !(isNameValid && isAddressValid && isEmailValid && isNumberValid)
          }
          disabledStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}
          name="checkmark-outline"
          type="ionicon"
          color="#22cc22"
          size={screenWidth / 15}
          onPress={
            isNameValid && isAddressValid && isEmailValid && isNumberValid
              ? updateProfile
              : Keyboard.dismiss
          }
        />
      );
    } else if (isUpdating) {
      return (
        <ActivityIndicator
          color={Colors.secondary}
          size="large"
          style={{marginTop: 15}}
        />
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    onRender(showProfile, hideProfile);
  }, []);

  return (
    // {!isUpdating ? hideProfileForm : null} --> May be applied later
    <Animated.View style={[styles.container, animatedProfileStyle]}>
      <ScrollView contentContainerStyle={styles.scrollView} style={styles.form}>
        <Text style={styles.headerTitle}>My Profile</Text>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              !profileImage
                ? require('../../assets/images/default_profile_pic.png')
                : {uri: profileImage}
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
              placeholder="Name"
              placeholderTextColor="#aaa"
              maxLength={50}
              onChangeText={addName}
              onFocus={() => setIsEditing(true)}
              onBlur={validateName}
              value={name}
              style={styles.inputField}
              returnKeyType="go"
              onSubmitEditing={
                isNameValid && isAddressValid && isEmailValid && isNumberValid
                  ? updateProfile
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
              placeholder="Address(lodge details, street, e.t.c)"
              placeholderTextColor="#aaa"
              maxLength={150}
              onChangeText={addAddress}
              onFocus={() => setIsEditing(true)}
              onBlur={validateAddress}
              value={address}
              style={styles.inputField}
              returnKeyType="go"
              onSubmitEditing={
                isNameValid && isAddressValid && isEmailValid && isNumberValid
                  ? updateProfile
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
              onChangeText={email =>
                isValidatingEmail
                  ? ToastAndroid.show(
                      'Cannot edit value until validation is complete. Careful Next Time!',
                      ToastAndroid.LONG,
                    )
                  : addEmail(email)
              }
              onFocus={() => setIsEditing(true)}
              onBlur={validateEmail}
              value={email}
              style={styles.inputField}
              returnKeyType="go"
              onSubmitEditing={
                isNameValid && isAddressValid && isEmailValid && isNumberValid
                  ? updateProfile
                  : null
              }
              selectTextOnFocus
            />

            {isValidatingEmail ? (
              <ActivityIndicator color={Colors.secondary} size="small" />
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
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              maxLength={15}
              onChangeText={addNumber}
              onFocus={() => setIsEditing(true)}
              onBlur={validateNumber}
              value={number}
              style={styles.inputField}
              returnKeyType="go"
              keyboardType="number-pad"
              textContentType="telephoneNumber"
              onSubmitEditing={
                isNameValid && isAddressValid && isEmailValid && isNumberValid
                  ? updateProfile
                  : null
              }
              selectTextOnFocus
            />

            {renderValidationIcons(number, isNumberValid)}
          </View>
          {numberErrMsg ? (
            <Text style={styles.errorMsg}>{numberErrMsg}</Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Update Button */}

      {renderUpdateButton()}

      {/* Close button */}
      <Icon
        reverse
        name="close-outline"
        type="ionicon"
        color="rgba(0,0,0,0.7)"
        size={screenWidth / 15}
        onPress={hideProfile}
      />

      {/* Container For Selecting Profile Image */}

      <Animated.View
        style={[
          styles.imagePickerContainer,
          animatedImagePickerContainerStyle,
        ]}>
        <TouchableOpacity
          activeOpacity={0}
          onPress={hideImagePickerContainer}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
    </Animated.View>
  );
}
