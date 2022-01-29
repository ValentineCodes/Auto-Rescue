import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../constants/colors';

const screenWidth = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
  container: {
    width: '85%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20,
    borderRadius: 20,
    marginTop: -50,
  },
  headerTitle: {
    textAlign: 'left',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
  },
  headerInfo: {
    color: '#555',
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
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderRadius: 20,
  },
  inputField: {
    flex: 1,
    marginHorizontal: 10,
    color: 'black',
  },
  login: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
