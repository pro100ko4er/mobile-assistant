import React from "react";
import IconButton from "@mui/material/IconButton";
import { styled, Switch } from "@mui/material";
import { startRecording, stopRecording } from "../services/Recorder";
import { useState } from "react";
import MicIcon from '@mui/icons-material/Mic';

export default function ModeChanger({ mode, setMode, changeMode, socketInstance, voiceDuration, msgLabel }) {
    const [audioRecorder, setAudioRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    return (
        <IconButton onMouseDown={() => {
            setMode('voice');
            changeMode('voice');
            startRecording(socketInstance, audioRecorder, setAudioRecorder, isRecording, voiceDuration, msgLabel);
            setIsRecording(true);

        }
        }
            onMouseUp={() => {
                setMode('text');
                changeMode('text');
                stopRecording(audioRecorder);
                setIsRecording(false);
            }}

            sx={{ p: '10px' }} aria-label="chat-mode" component="span">
            <MicIcon
                sx={{ color: 'white' }}
            />
        </IconButton>
    );
}

