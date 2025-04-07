import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import * as Font from 'expo-font'; 

const backgroundImage = require('../../assets/image.jpg'); 

const Welcome = ({ navigation }) => { 
  const globalContext = useContext(Context);
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styleHere.container} 
      resizeMode="cover"
    >
      <View style={styleHere.textBox}>
        <Text style={styleHere.welcomeText}>Welcome To </Text>
        <Text style={styleHere.ourStoreText}>Our Flowers Store</Text>
        <Text style={styleHere.storeName}>JasFlora</Text>
        <Text style={styleHere.sloganText}>Where Every Flower Tells a Story</Text>
      </View>
      <TouchableOpacity
        style={styleHere.landingbutton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styleHere.buttonText}>Start The Journey</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styleHere = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center',
  },
  textBox: {
    padding: 15,
    alignItems: 'flex-start', // Align text to the left
    width: '80%', // Control width to prevent overflow
    borderWidth: 1, // Add border width
    borderColor: 'white', // White border color
    borderRadius: 15, // Optional: Rounded corners
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: Semi-transparent background
    color: 'white', // Ensure text inside remains white
  },
  welcomeText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'left', // Align text to the left
    marginBottom: 0,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  storeName: {
    fontSize: 70, // Larger font size for store name
    color: '#fff', // Different color for contrast
    textAlign: 'left', // Align text to the left
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  ourStoreText: {
    fontSize: 25, // Similar size to welcome text
    color: '#fff',
    textAlign: 'left', // Align text to the left
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  sloganText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'left', // Align text to the left
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  landingbutton: {
    position: 'absolute',
    bottom: 170, // Keeps button position unchanged
    width: "80%",
    height: 50,
    backgroundColor: "#e36084", // Rose background
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff', // White text color
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
    fontSize: 20,
  },
});

export default Welcome;
