import { useEffect } from "react";
import Tts from "react-native-tts";

export default function useTts(lang: string) {
    const tts_init = async (lang: string) => {
        await Tts.setDefaultRate(0.5);
        await Tts.setDefaultPitch(1.0);
        if(lang == 'en') {
         await Tts.setDefaultLanguage('en-US'); 
        }
        else {
         await Tts.setDefaultLanguage('ru-RU');
        }
      }

      const tts_speak = (message: string) => {
        Tts.getInitStatus().then(() => {
          Tts.speak(message, {
            iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
            rate: 0.5,
             androidParams: {
              KEY_PARAM_PAN: -1,
              KEY_PARAM_VOLUME: 0.5,
              KEY_PARAM_STREAM: 'STREAM_MUSIC',
             }
          });
        });
      }

      useEffect(() => {
        tts_init(lang).then(() => console.log("Tts is loaded!"))
      }, [lang])

      return {
        tts_speak
      }
}