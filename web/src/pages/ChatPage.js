import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, Typography} from "@mui/material";
import {useState} from "react";
import styles from '../styles/modules/Main.module.css'
import {LocaleIcon} from "../components/LocaleIcon";
import {
    sendMessage,
    onConnect,
    onDisconnect,
    onMessageAck,
    onVoiceAck,
    onVoiceDuration,
    changeMode,
    changeLocale,
    socketInstance,
    onCheckConnection
} from '../common/ws_api/ws_api';
import ModeChanger from "../components/ModeChanger";
import UserMessage from '../components/common/UserMessage';
import VoiceMessage from '../components/common/VoiceMessage';
import MimiMessage from '../components/common/MimiMessage';

/**
 *  This is a component for the Chat Page Input Text Field and the Voice Mode Switch
 * @returns {Element} - The Chat Page Input Text Field and the Voice Mode Switch
 * @constructor
 */
export default function CustomizedInputBase() {
    const [voiceValue, setVoiceValue] = useState('');
    const enVoice = 'Say "Hello Mimi" to wake me up';
    const ruVoice = 'Скажи "Привет, Мими"';
    const enText = 'Mimi: Hello, how may I help you?';
    const ruText = 'Мими: Привет, чем я могу помочь?';
    const [mode, setMode] = useState('text');
    const [locale, setLocale] = useState('EN');
    const [placeholder, setPlaceholder] = useState(enVoice);
    const [voiceDuration, setVoiceDuration] = useState(0);
    const [messages, setMessages] = useState([]);
    const [msgLabel, setMsgLabel] = useState(null);
    const [isLocaleDropdownOpen, setIsLocaleDropdownOpen] = useState(false);
    const reloadMessages = React.useCallback(() => {
        setMessages([...messages]);
    }, [messages]);

//on connect
    onConnect(() => {
        console.log('connected');
    });

//on disconnect
    onDisconnect(() => {
        console.log('disconnected');
    });

    const handleMessageAck = (message) => {
        console.log('message ack', message);
        setMsgLabel(message["label"]);
        messages.push({
            id: messages.length + 1,
            datetime: new Date().toISOString(),
            message: message["msg"],
            sender: (message['label'] === 'voice_transcript' ? 'user' : 'mimi'),
            type: 'text'
        });
        reloadMessages();
    }

    const handleVoiceAck = (message) => {
        console.log('Got voice ack');
        const audio_ack = new Audio('data:audio/wav;base64,' + message["msg"]);
        audio_ack.play()
    }

    const handleVoiceDuration = (duration) => {
        console.log('voice duration', duration);
        setVoiceDuration(duration);
    }
    const handleConnect = () => {
        console.log('connected');
    }

    const handleDisconnect = () => {
        console.log('disconnected');
    }

//on message ack
    React.useEffect(() => {
        // Setup event listeners when the component mounts
        onMessageAck(handleMessageAck);
        onVoiceAck(handleVoiceAck);
        onConnect(handleConnect);
        onDisconnect(handleDisconnect);
        onVoiceDuration(handleVoiceDuration);
        setPlaceholder(mode === 'voice' ? (locale === 'EN' ? enVoice : ruVoice) : (locale === 'EN' ? enText : ruText));
        // Remove event listeners when the component unmounts
        return () => {
            //remove event listeners
            socketInstance.off('message_ack', handleMessageAck);
            socketInstance.off('connect', handleConnect);
            socketInstance.off('disconnect', handleDisconnect);
            socketInstance.off('voice_ack', handleVoiceAck);
        };
    }, [messages, mode, locale, placeholder, reloadMessages, msgLabel]);

    return (<div>
        <div
        className={styles.messagesWrapper}
        >
            <div
                 id={'chat'}
                 ref={(el) => {
                     if (el) {
                        el.scrollTop = el.scrollHeight;
                     }
                 }}
                 className={styles.messageArea}>
                {messages.map((message) => {
                    //user message
                    if (message.sender === 'user') {
                        return (<UserMessage message={message} />)
                    } else {
                        //mimi message
                        if (message.type === 'voice') {
                            return (<VoiceMessage message={message} />)
                        } else {
                            return (<MimiMessage message={message} />)
                        }
                    }
                })}
            </div>
            <div style={{
                marginBottom: '100px', alignItems: "center"
            }}></div>
            <Paper
                className={styles.searchBar}
            >
                <IconButton type="button" sx={{
                    p: '10px',
                    color: 'black',
                }} aria-label="search">
                    <SearchIcon/>
                </IconButton>
                {mode !== 'voice' ? <InputBase
                        autoFocus={true}
                        sx={{
                            ml: 1, flex: 1, fontSize: '1rem', color: 'black', '&::placeholder': {
                                color: 'black', opacity: 1
                            }, '@media (max-width: 600px)': {
                                fontSize: '1rem', '&::placeholder': {
                                    fontSize: '1rem',
                                },
                            }, '@media (max-width: 400px)': {
                                fontSize: '0.8rem', '&::placeholder': {
                                    fontSize: '0.8rem',
                                },
                            }, '@media (max-width: 300px)': {
                                fontSize: '0.7rem', '&::placeholder': {
                                    fontSize: '0.7rem',
                                },
                            }, '@media (max-width: 200px)': {
                                fontSize: '0.6rem', '&::placeholder': {
                                    fontSize: '0.6rem',
                                },
                            },
                        }}
                        placeholder={placeholder}
                        onChange={(e) => onCheckConnection(() => console.log('connection checked'))}
                        onKeyDown={async (e) => {
                            onCheckConnection(() => console.log('connection checked'))
                            if (e.key === 'Backspace') {
                                sendMessage('\b')
                            } else if (e.key === 'Enter') {  
                                sendMessage({"payload": '\n', "label": msgLabel});
                                messages.push({
                                    id: messages.length + 1,
                                    datetime: new Date().toISOString(),
                                    message: e.target.value,
                                    sender: 'user',
                                    type: 'text'
                                });
                                setMsgLabel(null);
                                e.target.value = '';
                                reloadMessages();
                            } else {
                                if (e.key.length === 1) {
                                    async function sendText() {
                                        sendMessage(e.key);
                                    }

                                    await sendText();
                                }
                            }
                        }}
                    />
                    :
                    <IconButton
                        sx={{
                            ml: 1, flex: 1, fontSize: '1rem', color: 'black', '&::placeholder': {
                                color: 'black', opacity: 1
                            }, '@media (max-width: 600px)': {
                                fontSize: '1rem', '&::placeholder': {
                                    fontSize: '1rem',
                                },
                            }, '@media (max-width: 400px)': {
                                fontSize: '0.8rem', '&::placeholder': {
                                    fontSize: '0.8rem',
                                },
                            }, '@media (max-width: 300px)': {
                                fontSize: '0.7rem', '&::placeholder': {
                                    fontSize: '0.7rem',
                                },
                            }, '@media (max-width: 200px)': {
                                fontSize: '0.6rem', '&::placeholder': {
                                    fontSize: '0.6rem',
                                },
                            },
                        }}
                        onClick={async (e) => {
                            if (voiceValue === '') {
                                return;
                            }
                            setVoiceValue('');
                        }}
                    >
                        <InputAdornment
                            position="start">
                            <Typography
                                sx={{
                                    fontSize: '1rem', color: 'grey', '@media (max-width: 600px)': {
                                        fontSize: '1rem',
                                    }, '@media (max-width: 400px)': {
                                        fontSize: '0.8rem',
                                    }, '@media (max-width: 300px)': {
                                        fontSize: '0.7rem',
                                    }, '@media (max-width: 200px)': {
                                        fontSize: '0.6rem',
                                    },
                                }}
                            >{locale === 'EN' ? enVoice : ruVoice}</Typography>
                        </InputAdornment>
                    </IconButton>
                }
                <Paper
                    sx={{
                        display: 'flex',
                        borderRadius: '10px',
                        backgroundColor: '#705231',
                        color: '#ffffff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <ModeChanger
                        mode={mode}
                        setMode={setMode}
                        changeMode={changeMode}
                        socketInstance={socketInstance}
                        voiceDuration={voiceDuration}
                        msgLabel={{msgLabel}}
                    />
                    <IconButton onClick={() => {
                        setIsLocaleDropdownOpen(!isLocaleDropdownOpen);
                    }}
                                sx={{p: '10px'}} aria-label="language" component="span">
                        <LocaleIcon
                            inputprops={{
                                locale,
                                setLocale,
                                setPlaceholder,
                                ruVoice,
                                enVoice,
                                ruText,
                                enText,
                                changeLocale,
                                isLocaleDropdownOpen,
                                setIsLocaleDropdownOpen
                            }}
                        />
                    </IconButton>
                </Paper>
            </Paper>
        </div>
    </div>);
}