import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export interface WebsocketInterface {
    url: string,
    callbackConnect: () => any,
    onMessageCallback: (data: any) => any
}


export default function useWebsocket(props: WebsocketInterface) {
    const {url, callbackConnect, onMessageCallback} = props
    const ws = useRef(io(url)).current;

    const connect_ws = (callback: () => any) => {
        ws.on('connect', () => callback())
    }

    const reconnect_ws = (callback: () => any) => {
        ws.on('connect', () =>  callback())
        
    }
    
    const connect_error = (callback: (err: Error) => any) => {
        ws.on('connect_error', (err) => {
            callback(err)
        })
    }   

    const connect_close = (callback: () => any) => {
        ws.on('close', () => {
            callback()
        })
    }


    const onMessage = (callback: (data: any) => any) => {
        ws.io.engine.on('message', (data) => {
            console.log('verger')
            callback(data)
        })
    }
  
    const sendMessage = (message: string) => {
        ws.send(message)
    }


    const getLang = () => {
        sendMessage(JSON.stringify({type: "get_lang", message: ''}))
    }

    const changeLang = (lang: string) => {
        sendMessage(JSON.stringify({type: "change_lang", message: lang}))
    }


    useEffect(() => {
        connect_ws(() => {
            callbackConnect()
            onMessage(onMessageCallback)
        })

    }, [])


    return {
        connect_ws,
        reconnect_ws,
        connect_error,
        connect_close,
        onMessage,
        sendMessage,
        getLang,
        changeLang
    }
}