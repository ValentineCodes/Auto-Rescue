import {StyleSheet, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderRadius: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginTop: 30,
  },
  userInfo: {marginLeft: 10, flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: 100,
    width: screenWidth / 10,
    height: screenWidth / 10,
  },
  avatar: {width: '100%', height: '100%', borderRadius: 100},
  name: {
    fontSize: screenWidth / 22,
    fontWeight: 'bold',
    color: 'black',
  },
  address: {
    fontSize: screenWidth / 30,
    color: '#555',
  },
  location: {
    marginHorizontal: 10,
  },
  timestamp: {
    color: 'black',
    fontSize: 10,
  },
  menuOption: {
    color: 'black',
    fontSize: 16,
    paddingVertical: 7,
    marginLeft: 10,
  },
});
