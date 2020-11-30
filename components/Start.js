import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

const image = require('../assets/background-image.png');
export const Start = () => (
  <View style={styles.container}>
    <ImageBackground source={image} style={styles.image}>
      <Text style={styles.appTitle}>ChatTime</Text>
      <View style={styles.box1}>
        <View style={styles.yourContainer}>
          <Icon
            style={styles.yourIcon}
            name='person-outline'
            color='#000'
            size={25}
          />
          <TextInput style={styles.yourName} placeholder='Your Name' />
        </View>
        <View style={styles.backgroundColorContainer}>
          <Text style={styles.backgroundColorText}>
            Choose Background Color:
          </Text>
          <View style={styles.chatButtonColor}>
            <View style={styles.chatButton1}></View>
            <View style={styles.chatButton2}></View>
            <View style={styles.chatButton3}></View>
            <View style={styles.chatButton4}></View>
          </View>
        </View>
        <TouchableOpacity style={styles.chatStartButton}>
          <Text style={styles.chatStartButtonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {},
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
  appTitle: {
    top: 30,
    fontSize: 45,
    fontWeight: 600,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  box1: {
    width: '88%',
    height: '44%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    bottom: 20,
  },
  yourContainer: {
    flexDirection: 'row',
    position: 'relative',
    marginTop: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '88%',
    borderColor: '#757083',
    borderWidth: 2,
    borderRadius: 3,
    padding: 10,
  },
  yourIcon: {
    fontSize: 10,
    paddingRight: 5,
    color: '#757083',
    opacity: 0.2,
  },
  yourName: {
    fontSize: 16,
    width: '100%',
    fontWeight: '300',
    opacity: 50,
    color: '#757083',
  },
  backgroundColorContainer: {
    flexDirection: 'column',
  },
  backgroundColorText: {
    marginTop: 40,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: '500',
    color: '#757083',
  },
  chatButtonColor: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chatButton1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
  },
  chatButton2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
  },
  chatButton3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
  },
  chatButton4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
  },
  chatStartButton: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#757083',
    width: '88%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 15,
  },
  chatStartButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
