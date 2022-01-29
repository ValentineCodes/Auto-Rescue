import {StyleSheet, Dimensions} from 'react-native';

import {Colors} from '../constants/colors';

const SCREENWIDTH = Dimensions.get('screen').width;
const SCREENHEIGHT = Dimensions.get('screen').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    paddingVertical: 30,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SCREENWIDTH / 18,
    fontWeight: 'bold',
    color: 'red',
  },
  headerCaption: {
    fontSize: SCREENWIDTH / 22,
    fontWeight: 'bold',
    color: 'black',
    marginTop: -5,
  },
  inputTitle: {
    fontSize: SCREENWIDTH / 22,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 10,
    alignSelf: 'flex-start',
  },
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: '100%',
    marginHorizontal: 10,
    alignSelf: 'flex-start',
    color: 'black',
  },
  videoContainer: {
    width: '100%',
    height: SCREENWIDTH / 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  videoIcon: {
    marginTop: 20,
  },
});
