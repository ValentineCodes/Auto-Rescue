import firestore, {firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const _sendReport = (user, uID, coords, onReport) => {
  // Sending the chatID with the report so the Admin can send messages to the document
  firestore()
    .collection('reports')
    .add({
      name: user.name,
      address: user.address,
      email: user.email,
      number: user.number,
      uID,
      coords: [coords],
      timestamp: firestore.FieldValue.serverTimestamp(),
      handled: false,
      moreInfo: {
        description: '',
      },
    })
    .then(snapshot => {
      let id = snapshot._documentPath._parts[1];

      onReport.dispatchReportId(id);
      onReport.setIsReporting(false);
      onReport.navigation.navigate('MoreInfo');
      onReport.displayMsg('Crime Reported!!!');
      onReport.showMoreInfo();

      firestore()
        .collection('users')
        .doc(uID)
        .update({
          reports: firestore.FieldValue.increment(1),
        });
    })
    .catch(err => {
      // onReport.displayMsg('Report Failed!. Must be your Data Connection'),
      onReport.setIsReporting(false);
      return;
    });
};

export const _processReport = (coords, onReport) => {
  //Get user id from local storage
  AsyncStorage.getItem('user_ID')
    .then(uID => {
      // Check if user has been blocked from sending report
      firestore()
        .collection('users')
        .doc(uID)
        .get()
        .then(user => user.data())
        .then(user => {
          if (!user.blocked) {
            _sendReport(user, uID, coords, onReport);
          } else {
            onReport.displayMsg('You have been blocked from sending reports');
            onReport.setIsReporting(false);
          }
        })
        .catch(err => {
          return;
        });
    })
    .catch(err => {
      return;
    });
};

export const _addMoreInfo = (reportId, info, onUpdate) => {
  onUpdate.setIsUpdating(true);
  firestore()
    .collection('reports')
    .doc(reportId)
    .update({
      moreInfo: info,
    })
    .then(report => {
      onUpdate.setIsUpdating(false);
      onUpdate.displayMsg('Description Sent Successfully.');
    })
    .catch(err => {
      onUpdate.setIsUpdating(false);
      onUpdate.displayMsg(
        'Description Failed To Send. Must be your data connection!',
      );
      return;
    });
};

export const _addNewCoords = (reportID, coords) => {
  firestore()
    .collection('reports')
    .doc(reportID)
    .update({
      coords: firebase.firestore.FieldValue.arrayUnion(coords),
    })
    .catch(err => {
      return;
    });
};
