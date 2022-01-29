import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const _validateEmail = async (email, onValidateEnd, handleErr) => {
  firestore()
    .collection('users')
    .where('email', '==', email)
    .get()
    .then(snapshot => {
      if (snapshot.docs[0] === undefined) {
        onValidateEnd.setIsEmailValid(true);
        onValidateEnd.setEmailErrMsg('');
      } else {
        onValidateEnd.setIsEmailValid(false);
        onValidateEnd.setEmailErrMsg('Email Already Exists. Try another one.');
      }

      onValidateEnd.setIsValidatingEmail(false);
    })
    .catch(err => handleErr('Email Validation Failed!. Please try again.'));
};

export const _validateNIN = (NIN, onValidateEnd, handleErr) => {
  firestore()
    .collection('users')
    .where('nin', '==', NIN)
    .get()
    .then(snapshot => {
      if (snapshot.docs[0] === undefined) {
        onValidateEnd.setIsNINValid(true);
        onValidateEnd.setNINErrMsg('');
      } else {
        onValidateEnd.setIsNINValid(false);
        onValidateEnd.setNINErrMsg('NIN Already Exists. Try another one.');
      }
      onValidateEnd.setIsValidatingNIN(false);
    })
    .catch(err => handleErr('NIN Validation Failed!. Please try again.'));
};

export const _addUser = (user, hideRegForm, setIsCreating, handleErr) => {
  firestore()
    .collection('users')
    .add({
      img: user.img,
      name: user.name,
      address: user.address,
      email: user.email,
      nin: user.NIN,
      number: user.number,
      blocked: false,
      joinedOn: firestore.FieldValue.serverTimestamp(),
    })
    .then(snapshot => snapshot.id)
    .then(userID => {
      // Save user id
      AsyncStorage.setItem('user_ID', userID)
        .then(res => {
          // Get user data from database
          setIsCreating(false);
          // Remove Registeration Screen
          hideRegForm(user);
        })
        .catch(err => {
          handleErr('Something went wrong. Please try again');
        });
    })
    .catch(err => {
      handleErr('Registration Failed!. Must be your Data Connection:::');
    });
};

export const _retrieveUser = (user, goToHome, handleErr) => {
  // Check if Email Exists
  firestore()
    .collection('users')
    .where('nin', '==', user.NIN)
    .get()
    .then(snapshot => {
      // Check if NIN exists
      if (snapshot.docs.length === 0) {
        handleErr('Invalid NIN!. Try again');
      } else {
        snapshot.forEach(doc => {
          AsyncStorage.setItem('user_ID', doc.id)
            .then(res => {
              goToHome(doc.data());
            })
            .catch(err => {
              return;
            });
        });
      }
    })
    .catch(err => handleErr('Something went wrong. Please try again'));
};

export const _updateUser = (user, onUpdate, handleErr) => {
  // Get user id
  AsyncStorage.getItem('user_ID')
    .then(userID => {
      // Update User Profile
      firestore()
        .collection('users')
        .doc(userID)
        .update({
          img: user.img,
          name: user.name,
          address: user.address,
          email: user.email,
          number: user.number,
        })
        .then(res => {
          onUpdate.displayMsg('Profile Successfully Updated.');
          onUpdate.setIsUpdating(false);
          onUpdate.setIsEditing(false);
          onUpdate.dispatch({
            type: 'addProfile',
            payload: user,
          });
        })
        .catch(err => {
          handleErr('Updating Failed!. Try again');
        });
    })
    .catch(err => {
      handleErr('Something went wrong!. Please try again');
    });
};
