import { Image, StyleSheet, View, ViewStyle } from "react-native";
import { ColorsInterface } from "../../constants/colors";
import { ReactElement, ReactNode, useMemo } from "react";
import useColors from "../../hooks/useColors";

import AppText from "../controls/text/app-text";
import layout from "../../layout";
import moment from "moment";

export interface MessageInterface {
    id: number,
    message: string,
    sender: string,
    datetime: string,
    icon: ReactNode | string,
    type: 'text' | 'voice'
}



export interface MessageProps {
    message: MessageInterface,
    style?: ViewStyle
}



export default function Message(props: MessageProps) {
    const {message, style} = props
    const colors = useColors()
    const styles = useMemo(() => getStyles(colors), [colors])
    return (
        <View style={{...styles.wrapper, ...style}}>
            <View style={styles.icon}>
                {typeof message.icon === 'string' ? <Image source={{uri: message.icon}} /> : message.icon}
            </View>
            <View style={styles.description}>
                <AppText style={styles.text}>{message.message}</AppText>
                <AppText style={styles.textSender}>{message.sender}</AppText>
                <AppText style={styles.textTime}>{moment(message.datetime).fromNow()}</AppText>
            </View>
        </View>
    )
}

function getStyles(colors: ColorsInterface) {
    return StyleSheet.create({
        wrapper: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 20,
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
            paddingRight: 10,
            maxWidth: layout.width - 10,
        },
        icon: {

        },
        description: {
            justifyContent: 'center',
            flexDirection: 'column'
        },
        text: {
            color: colors.text.black,
            
        },
        textSender: {
            color: colors.text.grey
        },
        textTime: {
            color: colors.text.grey
        }
    })
}