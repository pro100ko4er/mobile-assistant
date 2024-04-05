import {
  Image,
  ImageBackground,
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {ColorsInterface} from '../constants/colors';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import useColors from '../hooks/useColors';
import Switcher from '../components/common/switcher';
import layout from '../layout';
import Message, {MessageInterface} from '../components/common/message';
import {UserSvg} from '../assets/svg/user';
import AppText from '../components/controls/text/app-text';
import {RobotSvg} from '../assets/svg/robot';
// import useWebsocket from "../core/services/ws/hooks/useWebsocket";
import useRecording from '../core/services/recorder/hooks/useRecording';
import useTts from '../core/services/tts/hooks/useTts';
import {ServerMessageProps} from '../core/services/ws/types';
import {
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
} from '../core/services/ws/ws_api';
import WriteAudio from '../core/utils/write-audio';
import WriteAndPlayAudio from '../core/utils/write-play-audio';
export default function MainScreen() {
  const colors = useColors();
  const enVoice = 'Say "Hello Mimi" to wake me up';
  const ruVoice = 'Скажи "Привет, Мими"';
  const enText = 'Mimi: Hello, how may I help you?';
  const ruText = 'Мими: Привет, чем я могу помочь?';
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [voiceMode, setVoiceMode] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [lastSentText, setLastSentText] = useState<string>('');
  const [serverState, setServerState] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [voiceDuration, setVoiceDuration] = useState<number>(0);
  const [msgLabel, setMsgLabel] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>(enText);
  const [mode, setMode] = useState<string>('text');
  const [locale, setLocale] = useState<string>('EN');

  const chatRef = useRef<ScrollView>(null);

  const {audioStart, audioStop} = useRecording(socketInstance, msgLabel);

  const {tts_speak} = useTts(locale);

  const reloadMessages = React.useCallback(() => {
    setMessages([...messages]);
    chatRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  //on connect
  onConnect(() => {
    console.log('connected');
  });

  //on disconnect
  onDisconnect(() => {
    console.log('disconnected');
  });

  const handleMessageAck = (message: ServerMessageProps) => {
    console.log(message);
    console.log('message ack', message);
    setMsgLabel(message['label']);
    messages.push({
      id: messages.length + 1,
      datetime: new Date().toISOString(),
      message: message.msg,
      sender: message.label === 'voice_transcript' ? 'user' : 'mimi',
      type: 'text',
      icon: message.label === 'voice_transcript' ? <UserSvg /> : <RobotSvg />,
    });
    reloadMessages();
  };

  const handleVoiceAck = (message: ServerMessageProps) => {
    console.log(message);
    //   console.log('Got voice ack');
    //   messages.push({
    //       id: messages.length + 1,
    //       datetime: new Date().toISOString(),
    //       message: message.msg,
    //       sender: 'mimi',
    //       type: 'voice',
    //       icon: <RobotSvg />
    //   });
    //   reloadMessages();
    WriteAndPlayAudio(message.msg);
  };

  const handleVoiceDuration = (duration: number) => {
    console.log('voice duration', duration);
    setVoiceDuration(duration);
  };
  const handleConnect = () => {
    console.log('connected');
    setServerState(true);
  };

  const handleDisconnect = () => {
    console.log('disconnected');
    setServerState(false);
  };

  const handleTextChange = (text: string) => {
    if (text[text.length - 1] === '\n') {
      console.log(text[text.length - 1]);
    }
    console.log('Text: ' + text);
    onCheckConnection(() => console.log('connection reset'));
    setRecognizedText(text);
    // if(text === '\n') {
    //   setMessages([...messages, {id: messages.length + 1, message: recognizedText, sender: 'user', 'icon': <UserSvg />, datetime: new Date().toISOString(), type: 'text'}])
    // }
    // const newText = text.slice(lastSentText.length);
    // if (text.length <= recognizedText.length) {
    //   setLastSentText(text)
    // }
    console.log('last send text ' + lastSentText);
    console.log('text ' + text);
    // if (newText.length >= 8) {
    sendMessage(text[text.length - 1]);
    // setMessages([...messages, {id: messages.length + 1, message: newText, sender: 'user', 'icon': <UserSvg />, datetime: new Date().toISOString(), type: 'text'}])
    setLastSentText(text); // Обновляем lastSentText после отправки
    console.log('sended text ' + lastSentText);
    console.log(messages);
    // }
  };

  const handleClickKeys = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    console.log('Pressed key: ' + e.nativeEvent.key);
    onCheckConnection(() => console.log('connection reset'));
    // if(e.nativeEvent.key === 'Enter') {
    // const newText = recognizedText.slice(lastSentText.length);
    // console.log("new text to enter" + newText)
    // if(newText.replaceAll(' ', '').trim().length >= 1 && newText[0] !== '') {
    // console.log("new text" + recognizedText)
    // sendMessage({type: "text", label: "text", payload: '\n'});
    // setRecognizedText('')
    // messages.push({id: messages.length + 1, message: recognizedText, sender: 'user', 'icon': <UserSvg />, datetime: new Date().toISOString(), type: 'text'})
    // setLastSentText(recognizedText);
    // reloadMessages()
    // }
    // }
    if (e.nativeEvent.key === 'Backspace') {
      sendMessage('\b');
    }
  };

  const handleEnter = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (recognizedText.trim() !== '') {
      console.log('new text' + recognizedText);
      sendMessage({type: 'text', label: msgLabel, payload: '\n'});
      setRecognizedText('');
      messages.push({
        id: messages.length + 1,
        message: recognizedText,
        sender: 'user',
        icon: <UserSvg />,
        datetime: new Date().toISOString(),
        type: 'text',
      });
      setLastSentText(recognizedText);
      reloadMessages();
    }
  };

  const changeLang = () => {
    if (locale == 'EN') {
      changeLocale('RU');
      setLocale('RU');
      setPlaceholder(ruText);
    } else {
      changeLocale('EN');
      setLocale('EN');
      setPlaceholder(enText);
    }
  };
  const switcherVoiceMode = async (voiceMode: boolean) => {
    setVoiceMode(voiceMode);
    console.log('voice mode: ' + voiceMode);
    onCheckConnection(() => console.log('connection reset'));
    if (voiceMode) {
      await audioStart(voiceDuration);
    } else {
      console.log('Audio stop');
      await audioStop();
    }
  };

  // useEffect(() => {
  //     switcherVoiceMode()
  //     console.log(recognizedText)
  // }, [voiceMode])

  //on message ack
  useEffect(() => {
    // Setup event listeners when the component mounts
    onMessageAck(handleMessageAck);
    onVoiceAck(handleVoiceAck);
    onConnect(handleConnect);
    onDisconnect(handleDisconnect);
    onVoiceDuration(handleVoiceDuration);
    // onCheckConnection(() => console.log('connection reset'))
    setPlaceholder(
      voiceMode
        ? locale === 'EN'
          ? enVoice
          : ruVoice
        : locale === 'EN'
        ? enText
        : ruText,
    );
    // Remove event listeners when the component unmounts
    return () => {
      //remove event listeners
      socketInstance.off('message_ack', handleMessageAck);
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('voice_ack', handleVoiceAck);
    };
  }, [messages, voiceMode, locale, placeholder, reloadMessages, msgLabel]);

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../assets/images/background.jpeg')}
      resizeMode="cover">
      <View style={styles.wrapper}>
        <ScrollView
          ref={chatRef}
          contentContainerStyle={{
            ...styles.messages,
            alignItems: messages.length <= 0 ? 'center' : 'flex-start',
          }}>
          {messages.length >= 1 ? (
            messages.map((item, index) => {
              return (
                <Message
                  style={{
                    alignSelf:
                      item.sender !== 'user' ? 'flex-start' : 'flex-end',
                    flexDirection:
                      item.sender !== 'user' ? 'row' : 'row-reverse',
                    marginBottom: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderBottomLeftRadius: item.sender !== 'user' ? 3 : 20,
                    borderBottomRightRadius: item.sender === 'user' ? 3 : 20,
                    marginLeft: item.sender !== 'user' ? 10 : 10,
                    backgroundColor:
                      item.sender !== 'user'
                        ? colors.lightGreen
                        : colors.lightBlue,
                  }}
                  message={item}
                  key={index}
                />
              );
            })
          ) : (
            <View style={styles.notice}>
              <AppText>Сообщений пока нет</AppText>
            </View>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.errors}>
            {!serverState ? (
              <>
                <Text style={styles.stateConnectionServer}>
                  Соединение с сервером...
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    onCheckConnection(() => console.log('reconnect'))
                  }>
                  <Image source={require('../assets/images/reload.png')} />
                </TouchableOpacity>
              </>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              // multiline={true}
              // numberOfLines={5}
              style={styles.textInput}
              placeholder={placeholder}
              onChangeText={e => handleTextChange(e)}
              value={recognizedText}
              onKeyPress={e => handleClickKeys(e)}
              onSubmitEditing={e => handleEnter(e)}
              blurOnSubmit={false}
            />
            <View style={styles.switchers}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderRadius: 25,
                  padding: 10,
                }}
                onPressIn={() => {
                  switcherVoiceMode(true);
                }}
                onPressOut={() => {
                  switcherVoiceMode(false);
                }}>
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../assets/images/voice-man.png')}
                />
              </TouchableOpacity>

              {/* <Switcher
                activeState={voiceMode}
                setActiveState={switcherVoiceMode}
                firstState={
                  <Image
                    style={{width: 20, height: 20}}
                    source={require('../assets/images/pen.png')}
                  />
                }
                secondState={
                  <Image
                    style={{width: 20, height: 20}}
                    source={require('../assets/images/voice-man.png')}
                  />
                }
              /> */}

              <TouchableOpacity
                onPress={() => changeLang()}
                style={styles.changeLang}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../assets/images/translate.jpg')}
                />
                <Text style={styles.activeLangText}>{locale}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

function getStyles(colors: ColorsInterface) {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    messages: {
      paddingTop: 20,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },
    textInput: {
      flex: 1,
      height: 50,
      color: 'red',
      width: layout.width - 140,
    },
    footer: {
      paddingBottom: 10,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 10,
    },
    switchers: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 10,
      gap: 20,
      backgroundColor: colors.brown,
      borderRadius: 10,
    },
    switcher: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    listenVoiceText: {
      color: 'red',
    },
    changeLang: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeLangText: {
      textTransform: 'uppercase',
      color: colors.text.white,
    },
    stateConnectionServer: {},
    message: {
      color: 'red',
    },
    errorField: {},
    errorTextField: {
      color: 'red',
    },
    errors: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    notice: {
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      padding: 10,
    },
  });
}
