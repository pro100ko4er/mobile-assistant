import useWebsocket from './hooks/useWebsocket.ts'

import io from 'socket.io-client';
import { ServerMessageProps } from './types.js';
import data from '../../../common/server_url.json'
import { Platform } from 'react-native';
// let socketUrl = data.mobile_server_url;
let socketUrl = 'http://10.0.0.112:5000';
let socket = io(socketUrl, {
    transports: ['websocket'],
    query: {
        "platform": Platform.OS
    },
});

const sendMessage = (message: string | Object) => {
    socket.emit('message', message);
};

const changeMode = (mode: string) => {
    socket.emit('change_mode', {mode});
};

const changeLocale = (locale: string) => {
    socket.emit('change_locale', {locale});
};

const onConnect = (callback: () => any) => {
    socket.on('connect', callback);
};



const onCheckConnection = (callback: () => void) => {
    if(!socketInstance.connected) {
        onConnect(() => {
          console.log('connect is reset')
          
        })
      }
      callback()
}


const onDisconnect = (callback: () => any) => {
    socket.on('disconnect', callback);
};

const onMessageAck = (callback: (message: ServerMessageProps) => any) => {
    socket.on('message_ack', callback);
};

const onVoiceAck = (callback: (message: ServerMessageProps) => any) => {
    socket.on('voice_ack', callback);
};

const onVoiceDuration = (callback: (duration: number) => any) => {
    socket.on('voice_duration', callback);
}




const socketInstance = socket;

export {
    useWebsocket, 
    socketInstance,
    sendMessage,
    changeMode,
    changeLocale,
    onConnect,
    onDisconnect,
    onMessageAck,
    onVoiceAck,
    onVoiceDuration,
    onCheckConnection,
    
}