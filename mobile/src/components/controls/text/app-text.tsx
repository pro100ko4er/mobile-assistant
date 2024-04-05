import { ReactNode, useMemo } from "react";
import { ColorsInterface } from "../../../constants/colors";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";
import useColors from "../../../hooks/useColors";


export interface AppTextProps extends TextProps {
    children?: ReactNode,
    style?: TextStyle
}

export default function AppText(props: AppTextProps) {
    const {children, style} = props
    const colors = useColors()
    const styles = useMemo(() => getStyles(colors), [colors])
    return (
        <Text style={{...styles.text, ...style}}>
            {children}
        </Text>
    )
}


function getStyles(colors: ColorsInterface) {
    return StyleSheet.create({
        text: {
            color: colors.black,
            
        }
    })
}