import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import * as Font from 'expo-font'; // Import expo-font for loading fonts
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons

const backgroundImage = require('../../assets/image.jpg'); 

const Login = ({ navigation }) => { 
  const globalContext = useContext(Context);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true); // State for password visibility
  const { setIsLoggedIn, setClientObj, saveToken, saveRefreshToken, setToken, setRefreshToken, clientObj } = globalContext;

  // Load fonts using useEffect
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Poppins_400Regular': require('@expo-google-fonts/poppins/Poppins_400Regular.ttf'), 
      });
      setFontsLoaded(true); // Set fontsLoaded to true after loading
    };

    loadFonts();
  }, []);

  // Show loading screen until fonts are loaded
  if (!fontsLoaded) {
    return null; // You can return a loading indicator here if desired
  }

  const handleLogin = async () => {
    const credentials = {
      email: email.toLowerCase(),
      password: password
    };

    try {
      const response = await axios.post(`${globalContext.domain}/auth/login/`, credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const json = response.data;
      console.log("*****************json",json)

      // Set client data and token in context
      setClientObj(json.client);
      setToken(json.access); // Store access token
      saveToken(json.access); // Save to SecureStore
      setRefreshToken(json.refresh); // Store refresh token
      saveRefreshToken(json.refresh); // Save to SecureStore

      console.log("*****************clientObj",clientObj)
  
      // Update login state
      setIsLoggedIn(true);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      Alert.alert("Login Error", "Invalid Credentials");
    }    
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const togglePasswordVisibility = () => {
    setSecurePassword(prevState => !prevState);
  };

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.container} 
      resizeMode="cover"
    >
      <View style={styles.loginBox}>
        <Text style={styles.loginText}>Login</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Password" 
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={securePassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <MaterialIcons 
              name={securePassword ? "visibility-off" : "visibility"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword} style={{ marginTop: 10 }}>
          <Text style={styles.forgotPassText} >Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={() => navigation.navigate("Register")} // Navigate to Sign Up screen
        >
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for readability
    alignItems: 'center',
    width: '80%', // Control width to prevent overflow
  },
  loginText: {
    fontSize: 40,
    color: '#FFB6C1', // Contrast color
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light background for inputs
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#fff', // Input text color
    fontFamily: 'Poppins_400Regular',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative', // Added to position the icon
  },
  passwordInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light background for inputs
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff', // Input text color
    fontFamily: 'Poppins_400Regular',
  },
  eyeIcon: {
    position: 'absolute', // Position the icon absolutely
    right: 10, // Align the icon to the right inside the input
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#e36084", // Rose background
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff', // White text color
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  signUpButton: {
    marginTop: 20,
  },
  signUpText: {
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
  },
  forgotPassText: {
    color: '#FFB6C1',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
});

export default Login;
