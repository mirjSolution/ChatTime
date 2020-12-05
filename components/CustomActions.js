import React, { createRef } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import firebase from 'firebase';

const actionSheetRef = createRef();

const CustomActions = (props) => {
  // Image Picker
  const imagePicker = async () => {
    // expo permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try {
      if (status === 'granted') {
        // pick image
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        }).catch((error) => console.log(error));
        // canceled process
        if (!result.cancelled) {
          const imageUrl = await uploadImageFetch(result.uri);
          actionSheetRef.current?.setModalVisible(false);
          props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //   Take photo
  const takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await uploadImageFetch(result.uri);
          actionSheetRef.current?.setModalVisible(false);
          props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //   Get location
  const getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync(
          {}
        ).catch((error) => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const altitude = JSON.stringify(result.coords.latitude);
        if (result) {
          actionSheetRef.current?.setModalVisible(false);
          props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //  Upload image to firestore storage
  const uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  //   Show stylesheet
  const onPressVisible = () => {
    actionSheetRef.current?.setModalVisible(true);
  };

  //   Hide style sheet
  const onPressHide = () => {
    actionSheetRef.current?.setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel='More options'
        accessibilityHint='Let’s you choose to send an image or your geolocation.'
        style={[styles.container]}
        onPress={onPressVisible}
      >
        <View style={[styles.wrapper, props.wrapperStyle]}>
          <Text style={[styles.iconText, props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
      <ActionSheet ref={actionSheetRef}>
        <Text onPress={imagePicker} style={styles.actionsheetText}>
          CHOOSE IMAGE
        </Text>
        <Text onPress={takePhoto} style={styles.actionsheetText}>
          TAKE A PICTURE
        </Text>
        <Text onPress={getLocation} style={styles.actionsheetText}>
          SEND LOCATION
        </Text>
        <Text onPress={onPressHide} style={styles.actionsheetText}>
          CANCEL
        </Text>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsheetText: {
    textAlign: 'center',
    padding: 16,
    color: '#4286f4',
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomColor: '#4286f4',
  },

  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
