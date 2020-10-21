import React from 'react';
import * as firebase from 'firebase';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import TabNav from './src/screens/navigation/tab';
import Drawers from './src/screens/navigation/drawer';

import Login from './src/screens/login';
import Support from './src/screens/support';
import Register from './src/screens/register';
import Settings from './src/screens/settings';
import ChangeEmail from './src/screens/changeEmail';
import LoadingScreen from './src/screens/loadingscreen';
import ChangePassword from './src/screens/changePassword';
import CurrentLocation from './src/screens/currentLocation';

import Home from './src/screens/home';
import AddUsers from './src/screens/admin/addUsers';
import AdminHome from './src/screens/admin/adminHome';
import ViewUsers from './src/screens/admin/viewUsers';
import AddThingsToKnow from './src/screens/admin/addThingsToKnow';
import ViewThingsToKnow from './src/screens/admin/viewThingsToKnow';
import AddClimbingRoutes from './src/screens/admin/addClimbingRoutes';
import ViewClimbingRoutes from './src/screens/admin/viewClimbingRoutes';
import ForgotPassword from './src/screens/forgotPassword';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const firebaseConfig = {
  measurementId: 'G-4DN0QTY9FG',
  projectId: 'positive-altitude',
  messagingSenderId: '1052581473655',
  storageBucket: 'positive-altitude.appspot.com',
  authDomain: 'positive-altitude.firebaseapp.com',
  apiKey: 'AIzaSyB9t-55RD_sOx-UVGNwIHN-Ba5s75nPZHs',
  appId: '1:1052581473655:web:ff8d45ca315a95062c4572',
  databaseURL: 'https://positive-altitude.firebaseio.com',
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <Drawers {...props} />}>
        <Drawer.Screen name="TabNav" component={TabNav} />

        <Drawer.Screen name="Loading" component={LoadingScreen} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Register" component={Register} />
        <Drawer.Screen name="ForgotPassword" component={ForgotPassword} />

        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Support" component={Support} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen name="ChangeEmail" component={ChangeEmail} />
        <Drawer.Screen name="ChangePassword" component={ChangePassword} />
        <Drawer.Screen name="CurrentLocation" component={CurrentLocation} />

        <Drawer.Screen name="AddUsers" component={AddUsers} />
        <Drawer.Screen name="AdminHome" component={AdminHome} />
        <Drawer.Screen name="ViewUsers" component={ViewUsers} />
        <Drawer.Screen name="AddThingsToKnow" component={AddThingsToKnow} />
        <Drawer.Screen name="ViewThingsToKnow" component={ViewThingsToKnow} />
        <Drawer.Screen name="AddClimbingRoutes" component={AddClimbingRoutes} />
        <Drawer.Screen name="ViewClimbingRoutes" component={ViewClimbingRoutes} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
