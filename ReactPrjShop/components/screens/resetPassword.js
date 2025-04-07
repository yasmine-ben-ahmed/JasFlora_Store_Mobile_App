import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ImageBackground, StyleSheet } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../styles/inputField'; // Assuming this is your input field component
import * as Font from 'expo-font'; // Import expo-font for loading fonts

const backgroundImage = require('../../assets/image.jpg'); // Use the same background image

function ResetPassword({ route, navigation }) {
  const globalContext = useContext(Context);
  const { domain } = globalContext;

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { email } = route.params;

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

  const togglePasswordVisibility = () => {
    setSecurePassword(prevState => !prevState);
  };

  const handle = () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    let body = JSON.stringify({
      email: email.toLowerCase(),
      code: code,
      new_password: newPassword
    });

    fetch(`${domain}/auth/verify_code_and_reset_password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
    .then(res => res.json())
    .then(result => {
      if (result.message) {
        Alert.alert('Success', 'Your password has been reset successfully.');
        navigation.navigate('Login');
      } else {
        setError(result.error || "Failed to reset password. Please try again.");
        throw new Error('Failed to reset password');
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.formBox}>

        {/* Lock Icon inside a box */}
        <Icon name="lock" size={80} color="#FFB6C1" style={styles.lockIcon} />

        <Text style={styles.title}>Password Reset</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.instructionText}>
          Enter the code sent to your email and your new password.
        </Text>

        <InputField
          label="Code"
          icon="key"
          keyboardType="numeric"
          onChangeText={text => {
            const formattedText = text.replace(/\D/g, '').slice(0, 4);
            setCode(formattedText);
          }}
          value={code}
        />

        <InputField
          label="New Password"
          icon="lock"
          secureTextEntry={securePassword}
          onChangeText={text => setNewPassword(text)}
          value={newPassword}
          onEyePress={togglePasswordVisibility}
        />

        <InputField
          label="Confirm New Password"
          icon="lock"
          secureTextEntry={securePassword}
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          onEyePress={togglePasswordVisibility}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handle}>
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

export default ResetPassword;
