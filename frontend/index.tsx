import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './App.tsx';

const appName = 'main';

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication(appName, {
      initialProps: {},
      rootTag,
    });
  }
}
