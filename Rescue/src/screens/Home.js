import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
} from 'react-native';

import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MapView, {Marker} from 'react-native-maps';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

import {_processReport} from '../../api/reports';

import Header from '../components/Header';
import ReportButton from '../components/ReportButton';

import {Colors} from '../constants/colors';

import Contacts from './Contacts';
import Profile from './Profile';
import MoreInfo from './MoreInfo';

import {styles} from '../styles/home';

//Function declarations to show and hide Contacts and Profile Screen

//To be defined from the Contacts Screen Component
let showContacts;
let hideContacts;

let showProfile;
let hideProfile;

let showMoreInfo;
let hideMoreInfo;

const initialRegion = {
  latitude: 6.39067,
  longitude: 6.94409,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

const SCREENWIDTH = Dimensions.get('screen').width;

export default ({navigation}) => {
  const [isReporting, setIsReporting] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });

  let isProfileVisible = useRef(false);
  let isContactsVisible = useRef(false);

  const mapView = useRef();

  const dispatch = useDispatch();

  const dispatchReportId = id => {
    dispatch({
      type: 'addReportId',
      payload: id,
    });
  };

  const displayMsg = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };

  const goToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
    })
      .then(location => {
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        _processReport(
          {
            lat: location.latitude,
            long: location.longitude,
          },
          {
            dispatchReportId,
            displayMsg,
            setIsReporting,
            navigation,
            showMoreInfo: () => showMoreInfo(),
          },
        );

        // Center location on the map
        mapView.current.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          500,
        );
      })
      .catch(error => {
        setIsReporting(false);

        displayMsg('Unable to send report. Must be your Data Connection');
      });
  };

  const reportCrime = async () => {
    try {
      let permission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (permission) {
        // Request to enable location before sending report
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(status => {
            setIsReporting(true);
            getLocation(); // Report is processed in here
          })
          .catch(err => {
            return;
          });
      } else {
        permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (permission === 'granted') {
          // Request to enable location before sending report
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          })
            .then(status => {
              setIsReporting(true);
              getLocation(); // Report is processed in here
            })
            .catch(err => {
              return;
            });
        } else if (permission === 'denied') {
          setIsReporting(false);
          displayMsg('Cannot send report without access to your location.');
        } else {
          setIsReporting(false);
          displayMsg(
            'Cannot get location permission again unless the app is Reinstalled.',
          );
        }
      }
    } catch (err) {
      displayMsg(
        'Something went wrong when trying to send report. Please Try Again',
      );
    }
  };

  const showMyLocation = () => {
    if (userLocation.latitude !== null) {
      // Animate to my location
      mapView.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500,
      );
    }

    // Request to enable location
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(status => {
        if (userLocation.latitude === null) {
          displayMsg('Getting Location...');
        } else {
          displayMsg('Updating Location...');
        }

        // Get my current location
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 30000,
        })
          .then(location => {
            setUserLocation({
              latitude: location.latitude,
              longitude: location.longitude,
            });

            // Center location on the map
            mapView.current.animateToRegion(
              {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              },
              500,
            );
          })
          .catch(error => {
            displayMsg('Unable to get location. Must be your Data Connection');
          });
      })
      .catch(err => {
        return;
      });
  };

  const renderMarker = () => {
    if (userLocation.latitude && userLocation.longitude) {
      return <Marker coordinate={userLocation} title="Current Location" />;
    } else {
      return null;
    }
  };

  const showProfilePage = () => {
    showProfile();

    isProfileVisible.current = true;
  };

  const setProfileVisibleTo = () => {
    isProfileVisible.current = false;
  };

  const setContactsVisibleTo = bool => {
    isContactsVisible.current = bool;
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (isProfileVisible.current) {
      hideProfile();
    } else if (isContactsVisible.current) {
      hideContacts();
    } else {
      BackHandler.exitApp();
    }

    return true;
  });

  useEffect(() => {
    // Get Location
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
    })
      .then(location => {
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        // Center location on the map
        mapView.current.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          500,
        );
      })
      .catch(error => {
        return;
      });
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        ref={mapView}
        // customMapStyle={mapStyle}
        showsCompass={false}
        initialRegion={initialRegion}>
        {renderMarker()}
      </MapView>

      <Header
        showProfile={showProfilePage}
        goToNotifications={goToNotifications}
      />

      {/* Icon to animate to my location */}
      <TouchableOpacity
        onPress={showMyLocation}
        style={styles.myLocationButton}>
        <Icon
          reverse
          raised
          name="street-view"
          type="font-awesome"
          color="#5c5"
          reverseColor="white"
          size={SCREENWIDTH / 14}
        />
      </TouchableOpacity>

      {/* Emergency Call Button */}
      <TouchableOpacity
        onPress={() => showContacts()}
        style={styles.callButton}>
        <Icon
          reverse
          raised
          name="call"
          type="ionicon"
          color="#5c5"
          reverseColor="white"
          size={SCREENWIDTH / 14}
        />
      </TouchableOpacity>

      {/* Report Button */}
      <ReportButton reportCrime={reportCrime} isReporting={isReporting} />

      {/* Components below are rendered above other components */}

      {/* Emergency Contact */}
      <Contacts
        onRender={(show, hide) => {
          showContacts = show;
          hideContacts = hide;
        }}
        setContactsVisibleTo={setContactsVisibleTo}
      />

      {/* Profile */}
      <Profile
        onRender={(show, hide) => {
          showProfile = show;
          hideProfile = hide;
        }}
        notVisible={setProfileVisibleTo}
      />
    </View>
  );
};
