import {Avatar, Card, CardHeader, Typography} from "@mui/material";
import {red} from "@mui/material/colors";
import {Button} from "@mui/joy";
import { useState } from "react";
import moment from 'moment'
import styles from '../../styles/modules/VoiceMessage.module.css'
export default function VoiceMessage(props) {
    const {message, sx, className} = props
    let [isPlaying, setIsPlaying] = useState(false);
    const audio = new Audio('data:audio/wav;base64,' + message.message);
    return (
        <Card
        className={styles.wrapper}
                key={message.id}
                sx={{...sx}}>
                                <CardHeader
                                    key={message.id}
                                    avatar={<Avatar sx={{bgcolor: red[500]}} aria-label="chat">
                                        {message.sender.charAt(0)}
                                    </Avatar>}
                                    title={<div style={{overflow: "hidden", textOverflow: "ellipsis", width: '11rem'}}>
                                        <Typography sx={{
                                            fontSize: '1rem', color: 'black', '@media (max-width: 600px)': {
                                                fontSize: '1rem',
                                            }, '@media (max-width: 400px)': {
                                                fontSize: '0.8rem',
                                            }, '@media (max-width: 300px)': {
                                                fontSize: '0.7rem',
                                            }, '@media (max-width: 200px)': {
                                                fontSize: '0.6rem',
                                            },
                                        }}
                                        >
                                            {{
                                                false: (
                                                    <Button
                                                        style={{
                                                            scale: 1,
                                                            color: '#000000',
                                                            backgroundColor: '#ffffff',
                                                            border: 'none',
                                                            outline: 'none',
                                                            cursor: 'pointer',
                                                            padding: '5px',
                                                            borderRadius: '5px',
                                                            fontSize: '1rem',
                                                            textAlign: 'center',
                                                            textDecoration: 'none',
                                                            display: 'inline-block',
                                                            transition: '2s',
                                                        }}
                                                        onClick={(e) => {
                                                            audio.play();
                                                            setIsPlaying(true);
                                                        }}
                                                    >Play Voice</Button>
                                                )
                                            }[isPlaying]}
                                            {{
                                                true: (
                                                    <Button
                                                        style={{
                                                            scale: 1,
                                                            color: '#000000',
                                                            backgroundColor: '#ffffff',
                                                            border: 'none',
                                                            outline: 'none',
                                                            cursor: 'pointer',
                                                            padding: '5px',
                                                            borderRadius: '5px',
                                                            fontSize: '1rem',
                                                            textAlign: 'center',
                                                            textDecoration: 'none',
                                                            display: 'inline-block',
                                                            transition: '2s',
                                                        }}
                                                        onClick={(e) => {
                                                            audio.pause();
                                                            setIsPlaying(false);
                                                        }}
                                                    >Stop Voice</Button>
                                                )
                                            }[isPlaying]}
                                        </Typography>
                                    </div>}
                                    subheader={<>
                                        <div>
                                            <Typography>{message.sender}</Typography>
                                        </div>
                                        <div>
                                            <Typography>{moment(message.datetime).fromNow()}</Typography>
                                        </div>
                                    </>}
                                >
                                </CardHeader>
                            </Card>
    )
}