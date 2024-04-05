import useWebsocket from './hooks/useWebsocket.js'
import data from '../server_url.json'
import io from 'socket.io-client';

let socketUrl = data.web_sever_url;
let socket = io(socketUrl, {
    transports: ['websocket'],
    jsonp: false,
    query: {
        "platform": "web"
    },
});

const sendMessage = (message) => {
    socket.emit('message', message);
};

const changeMode = (mode) => {
    socket.emit('change_mode', {mode});
};

const changeLocale = (locale) => {
    socket.emit('change_locale', {locale});
};

const onConnect = (callback) => {
    socket.on('connect', callback);
};

const onDisconnect = (callback) => {
    socket.on('disconnect', callback);
};

const onMessageAck = (callback) => {
    socket.on('message_ack', callback);
};


const onCheckConnection = (callback) => {
    if(!socketInstance.connected) {
        onConnect(() => {
          console.log('connect is reset')
        })
      }
      callback()
}

const onVoiceAck = (callback) => {
    socket.on('voice_ack', callback);
};

const onVoiceDuration = (callback) => {
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
    onCheckConnection
}