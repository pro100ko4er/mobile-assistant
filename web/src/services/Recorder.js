export const startRecording = async (socket, audioRecorder, setAudioRecorder, isRecording, voiceDuration, msgLabel) => {
    if (isRecording) {
        console.log('Recording is already in progress');
        return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            sampleRate: 16000, // 16kHz sample rate
            channelCount: 1, // 1 channel
            frameSize: 1024, // 1024 frames per packet
            sampleSize: 16 // 16 bits per sample (2 bytes per sample as in original but clarified)
        }
    });

    audioRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    audioRecorder.ondataavailable = e => {
        // Send data to socket
        const audioBlob = new Blob([e.data], { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
            const base64data = reader.result.split(',')[1];
            socket.emit('voice', { data: base64data });
        };
        reader.readAsDataURL(audioBlob);
    };

    audioRecorder.onstop = async () => {
        // Wait for the last data to be sent
        await new Promise(resolve => setTimeout(resolve, 1000));
        socket.emit( 'voice_end', msgLabel );
    };

    audioRecorder.start(voiceDuration * 1000);
    setAudioRecorder(audioRecorder);

};


export const stopRecording = (audioRecorder) => {
    if (!audioRecorder) {
        console.log('No recording in progress');
        return;
    }
    audioRecorder.stop();
    audioRecorder = null;
};

