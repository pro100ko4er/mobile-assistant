/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import RootNavigator from './src/navigation';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

function App() {

  const bootstrap = async () => {

  }

  useEffect(() => {
    bootstrap()
    
  }, [])


  return (
   <RootNavigator />
  );
}


export default App;
