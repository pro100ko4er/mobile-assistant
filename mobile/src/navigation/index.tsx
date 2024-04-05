import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screens/main";
import { RootStackParamList } from "./types";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
    return (
        <> 
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='main' options={{animation: 'ios', headerShown: false}} component={MainScreen} />
        </Stack.Navigator>
        </NavigationContainer>
        <Toast />
        </>
    )
}
