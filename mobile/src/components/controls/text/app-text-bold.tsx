import { StyleSheet } from "react-native";
import { ColorsInterface } from "../../../constants/colors";
import AppText, { AppTextProps } from "./app-text";
import useColors from "../../../hooks/useColors";
import { useMemo } from "react";

export interface AppTextBoldProps extends AppTextProps {

}


export default function AppTextBold(props: AppTextBoldProps) {
    const {children, style} = props
    const colors = useColors()
    const styles = useMemo(() => getStyles(colors), [colors])
    return (
        <AppText style={{...styles, ...style}}>
            {children}
        </AppText>
    )
}


function getStyles(colors: ColorsInterface) {
    return StyleSheet.create({
        text: {
            fontWeight: 'bold'
        }
    })
}