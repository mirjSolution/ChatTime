# ChatTime

Chat app for mobile devices using React Native. The app will provide users with a chat interface and options to share images and their location.

![Alt text](/assets/chat-app.gif?raw=true 'ChatTime')

## Features

- Users can enter their name and choose a background color for the chat screen before joining the chat.
- Displaying the conversation, as well as an input field and submit button.
- Provide users with two additional communication features: sending images
  and location data.

## Technical

- React Native.
- Developed using Expo.
- Chat conversations stored in Google Firestore Database.
- Users can pick and send images from the phone’s image library.
- Users take pictures with the device’s camera app, and send them.
- Images stored in Firebase Cloud Storage.
- Read and send the user’s location data.

## Setting Up Expo to run and use the app

- To set up Expo and your development environment, you’ll need your terminal and Node.

- To start Expo, you’ll need to install the Expo Command Line Interface (CLI) on your machine. To do so, open up your terminal and type in the following command:

```
npm install expo-cli --global
```

-Next, you’ll need the Expo app for your phone to run your project on. Search for the Expo app in the relevant app store for your device (iOS or Android). The app icon should look something like this:

![Alt text](/assets/expo.png?raw=true 'ChatTime')

- Now, you need an Expo account. Head over to the [Expo signup page](https://expo.io/) and follow the instructions to create an account. Once that’s done, you should be able to log in to Expo from your browser and mobile app. At some point, you’ll be asked to log in to the Expo CLI, so do that, too, when it comes up:

This is how the Expo app will look on your phone right after installation:

### Install Dependencies

```
npm install
```
