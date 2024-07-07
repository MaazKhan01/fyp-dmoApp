/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from '@react-native-firebase/app';

AppRegistry.registerComponent(appName, () => App);


const firebaseConfig = {
  clientId: 'digital-meet-on',
  appId: '1:194506290484:android:cdc8e918feff98bfb2a161',
  apiKey: 'AIzaSyCIHauSLRNUq3ML1qYJeO3MMzYyXOxXhG0',
  authDomain: "digital-meet-online.firebaseapp.com",
  projectId: "digital-meet-online",
  databaseURL: 'https://digital-meet-online.firebaseio.com',
  storageBucket: 'digital-meet-on.appspot.com',
  messagingSenderId: '194506290484',
  projectId: 'digital-meet-on',
  
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

