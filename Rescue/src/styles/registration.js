import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../constants/colors';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export const styles = StyleSheet.create({
  overallContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    width: '85%',
    backgroundColor: 'white',
    // alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  scrollView: {alignItems: 'center', paddingBottom: 20},
  form: {
    width: '100%',
    maxHeight: screenWidth + 50,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
  },
  login: {
    position: 'absolute',
    top: 12,
    right: 10,
  },
  loginText: {
    color: Colors.secondary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  profileImageContainer: {
    width: screenWidth / 4,
    height: screenWidth / 4,
    marginTop: 15,
  },
  profileImage: {width: '100%', height: '100%', borderRadius: 100},
  editButton: {position: 'absolute', bottom: -5, right: -10},

  popUpLayer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: screenWidth,
    height: screenHeight,
  },
  imagePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerButton: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imagePickerButtonText: {
    color: 'black',
  },

  fieldContainer: {
    width: '95%',
    marginTop: 15,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    width: '100%',
    paddingLeft: 10,
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderRadius: 20,
  },
  inputField: {
    flex: 1,
    marginHorizontal: 10,
    color: 'black',
  },
  errorMsg: {
    color: '#b3001e',
    marginLeft: 15,
    marginTop: 5,
  },
  signUp: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
});
