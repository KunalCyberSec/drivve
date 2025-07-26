import React from "react";
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from "@react-navigation/stack";
// Removed NavigationContainer import to avoid nesting error
import SplashScreen from "../screens/SplashScreen.tsx";
import LoginScreen from "../screens/LoginScreen.tsx";
import OtpScreen from "../screens/OtpScreen.tsx";
import CreateProfile from "../screens/CreateProfile.tsx";
import { Easing } from "react-native-reanimated";
import 'react-native-gesture-handler';
import HomeScreen from '../screens/HomeScreen.tsx';
import RideScreen from '../screens/RideScreen.tsx';
import DriveScreen from '../screens/DriveScreen.tsx';
import ProfileScreen from '../screens/ProfileScreen.tsx';

const Stack = createStackNavigator();

const config = {
  animation: 'timing',
  config: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
  },
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        transitionSpec: {
          open: config,
          close: config,
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Ride" component={RideScreen} />
      <Stack.Screen name="Drive" component={DriveScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
