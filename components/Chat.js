// @refresh reset
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { API_TOKEN } from '@env';

const firebaseConfig = {
  apiKey: API_TOKEN,
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
          getMessages();
          setIsConnected(false);
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
  async function appendMessages(messages) {
    setMessages((prevState) => GiftedChat.append(prevState, messages));
    await AsyncStorage.setItem('messages', JSON.stringify(messages));
  }

  // Get messages from Async Storage when offline
  async function getMessages() {
    const messages = await AsyncStorage.getItem('messages');
    setMessages((prevState) =>
      GiftedChat.append(prevState, JSON.parse(messages))
    );
  }

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
  async function deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  }

  // Save messages on Fire base
  async function onSend(messages) {
    const chats = messages.map((m) => messageRef.add(m));
    await Promise.all(chats);
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        // renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={onSend}
        user={user}
      />
    </View>
  );
};

export default Chat;
