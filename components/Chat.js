// @refresh reset
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, LogBox, Button, Image } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

const firebaseConfig = {
  apiKey: 'AIzaSyDPNUJQmfvhe5gkiMiHUkPqS4g-SS9UNuY',
  authDomain: 'chattime-15ada.firebaseapp.com',
  projectId: 'chattime-15ada',
  storageBucket: 'chattime-15ada.appspot.com',
  messagingSenderId: '787409131895',
  appId: '1:787409131895:web:8e119439e84209fdc9e972',
};
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

LogBox.ignoreLogs(['Setting a timer for a long period of time', 'undefined']);

const db = firebase.firestore();
const messageRef = db.collection('messages');

const Chat = (props) => {
  // Aesthetics
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: `${props.route.params.backColor}`,
    },
  });

  // States
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      saveIdUserAS(user.uid, props.route.params.name);
    });
    const unsubscribe = messageRef.onSnapshot((querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === 'added')
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      NetInfo.fetch().then((connection) => {
        if (connection.isConnected) {
          // online will load firebase
          appendMessages(messagesFirestore);
          setIsConnected(true);
        } else {
          // Offline will load asyncstorage
          // getMessages();
          // setIsConnected(false);
        }
      });
    });
    // Component will unmount
    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  // Append messages to gifted chat
  const appendMessages = async (messages) => {
    setMessages((prevState) => GiftedChat.append(prevState, messages));
    // Enable in production
    // await AsyncStorage.setItem('messages', JSON.stringify(messages));
  };

  // Get messages from Async Storage when offline
  const getMessages = async () => {
    const messages = await AsyncStorage.getItem('messages');
    setMessages((prevState) =>
      GiftedChat.append(prevState, JSON.parse(messages))
    );
  };

  // Set user
  const saveIdUserAS = (uid, name) => {
    const _id = uid;
    const user = { _id, name };
    setUser(user);
  };

  // Optional you can change the color of the bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{ right: { backgroundColor: '#000' } }}
      />
    );
  };

  // Disable send in chat when offline
  const renderInputToolbar = (props) => {
    if (isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  // Delete messages from Async Storage after testing
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Save messages on Fire base
  const onSend = async (messages) => {
    const chats = messages.map((m) => messageRef.add(m));
    await Promise.all(chats);
  };

  // Pick Image
  const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        setImage(result);
      }
    }
  };

  // Take photo
  const takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // const { status1 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        setImage(result);
      }
    }
  };

  // Screen View
  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        // renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={onSend}
        user={user}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Button title='Pick an image from the library' onPress={pickImage} />
        <Button title='Take a photo' onPress={takePhoto} />
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
    </View>
  );
};

export default Chat;
