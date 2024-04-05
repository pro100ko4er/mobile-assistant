import io from 'socket.io-client';

let socketUrl = 'http://localhost:5000';
let socket = io(socketUrl, {
    transports: ['websocket'],
    jsonp: false,
    query: {
        "platform": "web"
    }
});

export const sendMessage = (message) => {
    socket.emit('message', message);
};

export const changeMode = (mode) => {
    socket.emit('change_mode', {mode});
};

export const changeLocale = (locale) => {
    socket.emit('change_locale', {locale});
};

export const onConnect = (callback) => {
    socket.on('connect', callback);
};

export const onDisconnect = (callback) => {
    socket.on('disconnect', callback);
};

export const onMessageAck = (callback) => {
    socket.on('message_ack', callback);
};

export const onVoiceAck = (callback) => {
    socket.on('voice_ack', callback);
};

export const onVoiceDuration = (callback) => {
    socket.on('voice_duration', callback);
}

export const socketInstance = socket;
