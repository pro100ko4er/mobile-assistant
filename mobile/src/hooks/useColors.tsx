import { ColorSchemeName, useColorScheme } from "react-native";
import { Colors } from "../constants/colors";

export default function useColors() {
    const scheme = useColorScheme() as NonNullable<ColorSchemeName>
    return Colors[scheme]
}