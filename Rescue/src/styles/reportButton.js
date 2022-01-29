import {StyleSheet, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: screenWidth / 1.7,
  },
  button: {
    width: screenWidth / 2,
    height: screenWidth / 2,
    borderRadius: 100,
    borderWidth: 0.4,
    borderColor: '#5c5',
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5c5',
  },
  text: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 'bold',
    fontSize: screenWidth / 25,
  },
});
