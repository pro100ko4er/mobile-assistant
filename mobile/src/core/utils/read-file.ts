import RNFS from 'react-native-fs';

export const readFile = async (filePath: string) => {
    try {
        const fileContent = await RNFS.readFile(filePath, 'base64');
        console.log(fileContent)
        return fileContent;
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
};