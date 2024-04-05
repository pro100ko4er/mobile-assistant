import Sound from "react-native-sound";

export default function PlayAudio(path: string) {
  Sound.setCategory('Playback')

        const sound = new Sound(path, "", error => {
          if (error) {
            console.error('Ошибка при воспроизведении аудио:', error);
            return;
          }
          sound.play(success => {
            if (!success) {
              console.error('Воспроизведение аудио не удалось');
            }
          });
        })
        
}