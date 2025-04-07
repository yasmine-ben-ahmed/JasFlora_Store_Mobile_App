import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../styles/inputField';
import * as Font from 'expo-font'; // Import expo-font for loading fonts

const backgroundImage = require('../../assets/image.jpg');

function ForgotPassword({ navigation }) {
  const globalContext = useContext(Context);
  const { domain } = globalContext;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Poppins_400Regular': require('@expo-google-fonts/poppins/Poppins_400Regular.ttf'), 
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // You can add a loading spinner here if needed
  }

  const handle = () => {
    setError("");

    let body = JSON.stringify({ email: email.toLowerCase() });

    fetch(`${domain}/auth/reset_password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(result => {
            setError(result.error || "Failed to send password reset link. Please try again.");
            throw new Error('Failed to send reset link');
          });
        }
      })
      .then(result => {
        if (!error) {
          Alert.alert('Success', 'A password reset link has been sent to your email.');
          navigation.navigate('ResetPassword', { email: email.toLowerCase() });
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.formBox}>
        {/* Lock Icon inside the box */}
        <Icon name="lock" size={80} color="#FFB6C1" style={styles.lockIcon} />
        
        <Text style={styles.title}>Password Reset</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.instructionText}>
          Enter your email address to begin the process.
        </Text>

        <InputField
          label="Email Address"
          icon="email"
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
          value={email}
        />

        <TouchableOpacity style={styles.submitButton} onPress={() => handle()}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for readability
    alignItems: 'center',
    width: '80%',
  },
  lockIcon: {
    marginBottom: 20, // Space between icon and title
  },
  title: {
    fontSize: 35,
    color: '#FFB6C1', // Contrast color for the title
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  submitButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#e36084", // Rose background
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff', // White text color
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
});

export default ForgotPassword;
