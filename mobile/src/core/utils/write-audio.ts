import RNFS from 'react-native-fs';


export default async function WriteAudio(data: any) {
    const audioFilePath = `${RNFS.DocumentDirectoryPath}/audio.mp3`;
    try {
        await RNFS.writeFile(audioFilePath, data, 'base64');
        console.log('Файл успешно записан:', audioFilePath);
        return audioFilePath
      } catch (error) {
        console.error('Ошибка при записи файла:', error);
      }
}