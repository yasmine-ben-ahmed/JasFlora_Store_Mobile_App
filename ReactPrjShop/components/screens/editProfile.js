import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from "../globalContext/globalContext.js";
import * as Font from 'expo-font'; 
import { LinearGradient } from 'expo-linear-gradient';

const backgroundImage = require('../../assets/image.jpg');

const EditProfile = ({ navigation }) => {
  const globalContext = useContext(Context);
  const { clientObj, setClientObj} = globalContext; // Getting the client object from context

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [firstName, setFirstName] = useState(clientObj.first_name || '');
  const [lastName, setLastName] = useState(clientObj.last_name || '');
  const [email, setEmail] = useState(clientObj.email || '');
  const [phone, setPhone] = useState(clientObj.phone || '');
  const [address, setAddress] = useState(clientObj.address || '');

  // Loading the custom fonts
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
    return null; // Add a loading spinner if needed
  }

  const handleSave = async () => {
    console.log("Saving changes...");
    setError(""); // Reset any existing errors
    const body = JSON.stringify({
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      address: address,
    });

    try {
      const response = await fetch(`${domain}/auth/update_profile/${clientObj.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: body,
      });

      console.log("Response status:", response.status); // Log status code
      const responseData = await response.json();
      console.log("Response body:", responseData); // Log response body

      if (response.ok) {
        console.log("Profile updated successfully!");
        const updatedUser = { ...clientObj, email, firstName, lastName, phone, address };
        setClientObj(updatedUser); // Update the global context state
        Alert.alert('Success', 'Profile updated successfully!');
        setTimeout(() => {
          navigation.goBack(); // This should navigate back to the profile screen
        }, 500); // Delay to ensure state update
      } else {
        console.log("Error data:", responseData); // Log error response
        setError(responseData.error || "Failed to update profile. Please try again.");
        Alert.alert('Error', responseData.error || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred. Please try again.");
      Alert.alert('Error', "An unexpected error occurred. Please try again.");
    }
  };
  
  return (
    <LinearGradient colors={['#f9adbd', '#ffe3ed']} style={styles.container}>
      <View style={styles.profileBox}>
        <Text style={styles.title}>Edit Profile</Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.inputField}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.inputField}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.inputField}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.inputField}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.inputField}
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 24,
    color: '#FFB6C1',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  label: {
    fontSize: 16,
    color: '#FFB6C1',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
    width: '100%', // Ensures label is aligned with input field
  },
  inputField: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#fff',
    width: '100%',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#e36084",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
});

export default EditProfile;
