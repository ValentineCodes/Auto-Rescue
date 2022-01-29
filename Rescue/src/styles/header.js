import {StyleSheet, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    width: '100%',
    paddingVertical: 22,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '26%',
  },
  logo: {
    fontSize: screenWidth / 17,
    fontWeight: 'bold',
    color: 'black',
  },
  caption: {
    color: '#C80900',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: -5,
  },
  profilePicContainer: {
    width: Dimensions.get('screen').width / 14,
    height: Dimensions.get('screen').width / 14,
    borderRadius: 100,
  },
  profilePic: {width: '100%', height: '100%', borderRadius: 100},
});
