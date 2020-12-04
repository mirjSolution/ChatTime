// @refresh reset
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import 'firebase/firestore';

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

const Chat = (props) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: `${props.route.params.backColor}`,
    },
  });

  const [messages, setMessages] = useState([]);
  const [uid, setuid] = useState('');

  const onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
      setMessages(messages);
    });
  };

  const onSend = (messages) => {
    // setMessages((previousState) => GiftedChat.append(previousState, messages))

    messages.map((data) => {
      referenceChatMessages.add({
        _id: data._id,
        text: data.text,
        createdAt: new Date(),
        user: data.user,
      });
    });
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{ right: { backgroundColor: '#000' } }}
      />
    );
  };

  // Get collection to firebase
  const referenceChatMessages = firebase.firestore().collection('messages');

  useEffect(() => {
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      setuid(user.uid);
      setMessages([]);
    });
    const unsubscribe = referenceChatMessages
      .orderBy('createdAt', 'desc')
      .onSnapshot(onCollectionUpdate);

    // component will unmount
    return () => {
      authUnsubscribe();
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={onSend}
        user={{
          _id: `${uid}`,
          name: `${props.route.params.name}`,
          avatar: 'https://placeimg.com/140/140/any',
        }}
      />
    </View>
  );
};

export default Chat;
