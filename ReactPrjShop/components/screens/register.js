import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InputField from '../styles/inputField';
import { Context } from "../globalContext/globalContext.js";
import * as Font from 'expo-font';

const backgroundImage = require('../../assets/image.jpg');

function Register() {
  const navigation = useNavigation(); // Correctly access navigation
  const globalContext = useContext(Context);
  const { domain, setClientObj, setToken } = globalContext;

  const [securePassword, setSecurePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
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
    return null;
  }

  const handleRegister = () => {
    setError("");

    const body = JSON.stringify({
      email: email.toLowerCase(),
      firstName,
      lastName,
      password,
      phone: phoneNumber,
      address,
    });

    fetch(`${domain}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then((res) => {
        if (res.ok) return res.json();
        setError("User already exists");
        throw res.json();
      })
      .then((json) => {
        setClientObj(json);
        setToken(json.token);
        Alert.alert("Success", "Registration successful. Please log in.", [
          { text: "OK", onPress: () => navigation.navigate('Login') },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const togglePasswordVisibility = () => {
    setSecurePassword((prev) => !prev);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.formBox}>
        <Text style={styles.h1}>Sign Up</Text>
        <Text style={styles.description}>Register with email</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <InputField label="First Name" icon="man" onChangeText={setFirstName} value={firstName} />
        <InputField label="Last Name" icon="man" onChangeText={setLastName} value={lastName} />
        <InputField label="Email Address" icon="email" keyboardType="email-address" onChangeText={setEmail} value={email} />
        <InputField label="Phone Number" icon="phone" keyboardType="phone-pad" onChangeText={setPhoneNumber} value={phoneNumber} />
        <InputField label="Address" icon="home" onChangeText={setAddress} value={address} />

        <View style={styles.passwordContainer}>
          <InputField
            label="Password"
            icon="lock"
            secureTextEntry={securePassword}
            onChangeText={setPassword}
            value={password}
            onEyePress={togglePasswordVisibility}
          />
        </View>

        <TouchableOpacity style={styles.login} onPress={handleRegister}>
          <Text style={styles.loginText}>Sign Up</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    width: '80%',
  },
  h1: {
    fontSize: 40,
    color: '#FFB6C1',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  description: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 10,
  },
  error: {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  login: {
    width: '100%',
    height: 50,
    backgroundColor: '#e36084',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginTop: 15,
  },
  loginText: {
    fontWeight: 'bold',
    color: '#666',
  },
});

export default Register;
