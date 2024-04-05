import PlayAudio from "./play-audio";
import WriteAudio from "./write-audio";

export default async function WriteAndPlayAudio(data: any) {
    const path = await WriteAudio(data)
    if(path) {
    PlayAudio(path)
    }
}