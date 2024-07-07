
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Authentication/Login';
import Signup from '../screens/Authentication/Signup';
import SplashAuth from '../screens/SplashScreen/SplashAuth';

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
    return (
        <Stack.Navigator initialRouteName='SplashAuth'>
            <Stack.Screen name="SplashAuth" component={SplashAuth} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default AuthScreens;