import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ColorsInterface } from "../../constants/colors";
import useColors from "../../hooks/useColors";
import { useMemo, useState } from "react";


export interface SwitcherProps {
    activeState: boolean,
    firstState: React.ReactNode,
    secondState: React.ReactNode,
    setActiveState: (state: boolean) => void
}

export default function Switcher(props: SwitcherProps) {
    const {activeState, firstState, secondState, setActiveState} = props
    const colors = useColors()
    const styles = useMemo(() => getStyles(colors), [colors])
    return (
    <TouchableOpacity onPress={() => setActiveState(!activeState)} style={styles.wrapper}>
        <View style={{...styles.runner, transform: activeState ? [{translateX: 30}] : [{translateX: 0}]}}></View>
        <View style={styles.firstState}> 
        {firstState}
        </View>
        <View style={styles.secondState}> 
        {secondState}
        </View>
    </TouchableOpacity>
    )
}


function getStyles(colors: ColorsInterface) {
    return StyleSheet.create({
        wrapper: {
            height: 30,
            width: 60,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 5,
            paddingRight: 5,
            backgroundColor: colors.green,
            borderRadius: 20
        },
        runner: {
            position: 'absolute',
            height: 30,
            width: 30,
            backgroundColor: colors.white,
            borderRadius: 20
        },
        runnerActive: {
            transform: [
                {translateX: 55}
            ]
        },
        firstState: {

        },
        secondState: {

        }
    })
}