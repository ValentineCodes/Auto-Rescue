import uuid from 'react-native-uuid';

let notifications = {
  private: [],
  broadcast: [],
};

export default function notificationsReducer(state = notifications, action) {
  if (action.type == 'addPrivateNotifications') {
    let newState = state;
    newState['private'] = action.payload;

    return newState;
  } else if (action.type == 'addBroadcastNotifications') {
    let newState = state;
    newState['broadcast'] = action.payload;

    return newState;
  } else {
    return state;
  }
}
