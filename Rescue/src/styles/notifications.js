import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../constants/colors';
const SCREENWIDTH = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
  container: {flex: 1, paddingBottom: 50},
  header: {borderBottomWidth: 1, borderColor: '#ccc'},
  navigator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  msgContainer: {
    marginTop: 10,
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  msg: {
    fontSize: SCREENWIDTH / 17,
  },
});
