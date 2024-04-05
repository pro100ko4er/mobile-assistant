import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid } from "react-native";
import AudioRecord from "react-native-audio-record";
import { Socket } from "socket.io-client";


export default function useRecording(socketInstance: Socket, msgLabel: string) {
    const [audioIsInited, setAudioIsInited] = useState<boolean>(false)
    const [buffer, setBuffer] = useState<Uint8Array[]>([]);
    const bufferStartTime = useRef<number|null>(null);

    const audioInit = async () => {
        const res = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        if(res) {
        const options = {
          sampleRate: 16000,  // default 44100
          channels: 1,        // 1 or 2, default 1
          bitsPerSample: 16,  // 8 or 16, default 16
          audioSource: 6,     // android only (see below)
          wavFile: 'AudioVoiceAssistant.wav', // default 'audio.wav'

        };
        console.log('Pre-init')
        AudioRecord.init(options);
        console.log('Post-init')
        setAudioIsInited(true)
        // AudioRecord.on('data', (data) => {
        //     // Start timing when the first chunk of data is received
        //     if (bufferStartTime.current === null) {
        //         console.log('Set time')
        //         bufferStartTime.current = Date.now();
        //     }

        //     console.log('Chunk size:', data.length)
        //     const newData = new Uint8Array(data);
        //     setBuffer(currentBuffer => [...currentBuffer, newData]);

        //     // Check if the accumulated data duration has reached voiceDuration
        //     const currentTime = Date.now();
        //     if(bufferStartTime.current) {
        //     if (bufferStartTime.current && (currentTime - bufferStartTime.current) >= 1000) {
        //         console.log(bufferStartTime.current)
        //       // Combine all chunks in buffer to a single Uint8Array
        //       const combinedData = new Uint8Array(buffer.reduce((acc, val) => acc.concat(Array.from(val)), []));
        //       console.log('Combined size:', combinedData.length)
        //       socketInstance.emit('voice', {data: combinedData})

        //       // Reset the buffer and timing
        //       setBuffer([]);
        //       bufferStartTime.current = null
        //     }
        // }
        // });
      }
      }

      const audioStart = async (voiceDuration: number) => {
        const res = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );; 
            if(res) {
              console.log('permission', res)
            
                AudioRecord.start()
                AudioRecord.on('data', (data) => {
                    // Start timing when the first chunk of data is received
                    if (bufferStartTime.current === null) {
                        console.log('Set time')
                        bufferStartTime.current = Date.now();
                    }
        
                    console.log('Chunk size:', data.length)
                    const newData = new Uint8Array(data);
                    setBuffer(currentBuffer => [...currentBuffer, newData]);
        
                    // Check if the accumulated data duration has reached voiceDuration
                    const currentTime = Date.now();
                    if(bufferStartTime.current) {
                    if (bufferStartTime.current && (currentTime - bufferStartTime.current) >= 1000) {
                        console.log(bufferStartTime.current)
                      // Combine all chunks in buffer to a single Uint8Array
                      const combinedData = new Uint8Array(buffer.reduce((acc, val) => acc.concat(Array.from(val)), []));
                      console.log('Combined size:', combinedData.length)
                      socketInstance.emit('voice', {data: combinedData})
        
                      // Reset the buffer and timing
                      setBuffer([]);
                      bufferStartTime.current = null
                    }
                }
                });
              
            } else {
              console.log('Get permission')
              PermissionsAndroid.request('android.permission.RECORD_AUDIO').then(res => {
                if(res === 'granted') {
                  return audioInit().then(() => {
                  
                      AudioRecord.start()
                      AudioRecord.on('data', (data) => {
                        // Start timing when the first chunk of data is received
                        if (bufferStartTime.current === null) {
                            console.log('Set time')
                            bufferStartTime.current = Date.now();
                        }
            
                        console.log('Chunk size:', data.length)
                        const newData = new Uint8Array(data);
                        setBuffer(currentBuffer => [...currentBuffer, newData]);
            
                        // Check if the accumulated data duration has reached voiceDuration
                        const currentTime = Date.now();
                        if(bufferStartTime.current) {
                        if (bufferStartTime.current && (currentTime - bufferStartTime.current) >= 1000) {
                            console.log(bufferStartTime.current)
                          // Combine all chunks in buffer to a single Uint8Array
                          const combinedData = new Uint8Array(buffer.reduce((acc, val) => acc.concat(Array.from(val)), []));
                          console.log('Combined size:', combinedData.length)
                          socketInstance.emit('voice', {data: combinedData})
            
                          // Reset the buffer and timing
                          setBuffer([]);
                          bufferStartTime.current = null
                        }
                    }
                    });
                  
                      
                  })
                }
              })
            }
      }

      const audioStop = async () => {
        await AudioRecord.stop()
            console.log('Label', msgLabel)
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Stopping recording')
            socketInstance.emit( 'voice_end', {"msgLabel": msgLabel} )
      }

      useEffect(() => {
        console.log('useEffect entry')
        audioInit()
        // console.log('Return - audio stop')
        // return () => AudioRecord.stop();
  
      }, [])

    //   console.log('Return - method')
      return {
        audioIsInited,
        audioStart,
        audioStop
      }
}
