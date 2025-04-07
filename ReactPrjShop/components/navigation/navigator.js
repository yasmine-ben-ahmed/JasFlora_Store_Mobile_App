import React, { useContext } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Context } from "../globalContext/globalContext.js";
import { headerStyle, headerHome, backButton } from "../styles/styles";
import OrderSummary  from '../screens/OrderSummary.js';
import Login from '../screens/login.js';
import Welcome from '../screens/welcome.js';
import Register from '../screens/register.js';
import checkout from '../screens/checkout.js';
import ForgotPassword from '../screens/forgotPassword.js';
import ResetPassword from '../screens/resetPassword.js';
import EditProfile from '../screens/editProfile.js';
import FlowerList from '../screens/FlowerList.js';
import { Ionicons } from '@expo/vector-icons'; 
import TabNavigator from './TabNavigator'; 

const Stack = createNativeStackNavigator();

function Navigator(props) {
  const globalContext = useContext(Context);
  const { isLoggedIn, clientObj, setIsLoggedIn } = globalContext;

  return (
    <Stack.Navigator initialRouteName="Welcome">
      {(!isLoggedIn || !clientObj) ? (
        <>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }} 
          />
        </>
      ) : (
<Stack.Screen
  name="Home"
  component={TabNavigator}
  options={({ navigation }) => ({
    ...headerHome,
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          setIsLoggedIn(false);
          navigation.replace('Landing'); // Navigate to the Landing screen
        }}
        style={{ 
          marginRight: 5, 
          flexDirection: 'row', 
          alignItems: 'center' 
        }}
      >
        <Ionicons 
          name="exit-outline" 
          size={20} 
          color="#666"
        />
      </TouchableOpacity>
    ),
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Navigate to the previous screen
        style={{
          marginLeft: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Ionicons 
          name="arrow-back-outline" 
          size={20} 
          color="#666"
        />
      </TouchableOpacity>
    ),
  })}
/>

      )}

    <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }} 
          />

          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }} 
          />
            <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: false }} 
          />

          <Stack.Screen
            name="FlowerList"
            component={FlowerList}
            options={{ headerShown: false }} 
          />

        <Stack.Screen
            name="checkout"
            component={checkout}
            options={{ headerShown: false }} 
          />

        <Stack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{ headerShown: false }} 
          />


    </Stack.Navigator>
  );
}

export default Navigator;
