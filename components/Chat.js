// @refresh reset
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, LogBox, ActivityIndicator } from 'react-native';

import MapView from 'react-native-maps';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import * as firebase from 'firebase';
import 'firebase/firestore';

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

import CustomActions from './CustomActions';

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
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      // Sign in user anonymously in firebase
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      saveIdUserAS(user.uid, props.route.params.name);
    });
    // Get save data in firestore filtered and sorted
    const unsubscribe = messageRef.onSnapshot((querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === 'added')
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      // Check if you are connected to wi-fi or LTE
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

  //custom map view
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
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
  const onSend = (messages) => {
    const message = messages[0];
    messageRef.add({
      _id: message._id,
      text: message.text || null,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
    console.log(message);
  };

  // render custom actions
  const renderCustomActions = (props) => <CustomActions {...props} />;

  // Screen View

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        // renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={onSend}
        user={user}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderLoading={() => {
          return (
            <ActivityIndicator style={{ flex: 1 }} size='large' color='blue' />
          );
        }}
      />
    </View>
  );
};

export default Chat;
