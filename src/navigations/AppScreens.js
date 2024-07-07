
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import TeacherHome from '../screens/Home/TeacherHome';
import RequestDetail from '../screens/RequestDetail/RequestDetail';
import EditProfile from '../screens/Profile/EditProfile';
import Profile from '../screens/Profile/Profile';
import CreateVisitor from '../screens/Visitors/CreateVisitor';
import TeacherDetail from '../screens/TeacherDetail/TeacherDetail';
import Scanner from '../screens/Home/Scanner';
import StudentHome from '../screens/Home/StudentHome';


const Stack = createNativeStackNavigator();

const AppScreens = () => {
    return (
        <Stack.Navigator initialRouteName='SplashScreen'>
            {/* <Stack.Screen name="SplashScreen" component={() => <SplashScreen navigateTo={'BottomTabs'} />} options={{ headerShown: false }} /> */}
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />

            <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
            <Stack.Screen name="TeacherHome" component={TeacherHome} options={{ headerShown: false }} />
            <Stack.Screen name="StudentHome" component={StudentHome} options={{ headerShown: false }} />

            <Stack.Screen name="RequestDetail" component={RequestDetail} options={{ headerShown: false }} />
            <Stack.Screen name="TeacherDetail" component={TeacherDetail} options={{ headerShown: false }} />

            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="CreateVisitor" component={CreateVisitor} options={{ headerShown: false }} />
            <Stack.Screen name="Scanner" component={Scanner} options={{ headerShown: false }} />

        </Stack.Navigator>
    );
}

export default AppScreens;