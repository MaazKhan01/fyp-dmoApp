import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../config/colors';
import TeacherHome from '../screens/Home/TeacherHome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import StudentHome from '../screens/Home/StudentHome';
import VisitorHome from '../screens/Home/VisiorHome';
import TeacherRecords from '../screens/Records/TeacherRecords';
import Visitors from '../screens/Visitors/Visitors';
import StudentRecords from '../screens/Records/StudentRecords';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const hideHeader = { headerShown: false }
  const userRole = useSelector(state => state.AuthReducer.userInfo?.data?.userRole)
  return (

    <Tab.Navigator
      labeled={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route?.name == 'Home') {
            iconName = 'home';
          } else if (route?.name == 'Records') {
            iconName = 'file-tray-full';
          } else if (route?.name == 'Visitors') {
            iconName = 'people-sharp';
          }
          return <Ionicons name={iconName} size={23} color={focused ? Colors?.BLUE : Colors?.GREY} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: Colors.BLUE_COLOR,
        tabBarInactiveTintColor: Colors.LGREY,
        tabBarStyle: {
          backgroundColor: Colors.WHITE,
          height: 60,
        },
      })}
    >

      <Tab.Screen name="Home" options={hideHeader}
        component={userRole == 'student' || userRole == 'visitor' ? StudentHome : TeacherHome}
      />

      <Tab.Screen name="Records" options={hideHeader}
        component={userRole == 'student' || userRole == 'visitor' ? StudentRecords : TeacherRecords} />

      {
        userRole == 'teacher' ?
          <Tab.Screen name="Visitors" component={Visitors} options={hideHeader} />
          :
          null
      }

    </Tab.Navigator>

  );
}