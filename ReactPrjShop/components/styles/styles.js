import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Create styles without dynamic settings
const styles = StyleSheet.create({
  outerPage: {
    backgroundColor: "#00AAA3",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
   
  },

  formBox: {
    width: "80%",
    height: "60%",
    backgroundColor: "#00AAA3",
    margin: 0,
    borderRadius: 15,
    padding: "6%",
  },

  /* ****************** landing.js***************** */
  login: {
    width: "100%",
    height: 35,
    backgroundColor: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  landingpage: {
    width: "70%",
    height: 35,
    backgroundColor: "beige",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  }, 
  skape: {
    width: "20%",
    height: 20,
    backgroundColor: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  /* ***************** welcome.js ******************* */
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  thankYouText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
  },
  startButton: {
    backgroundColor: '#005B59',
    padding: 15,
    borderRadius: 30,
    marginTop: 30,
    width: '60%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  /* ***************** forgotpassword.js ******************* */
  iconContainer: {
    borderRadius: 100, 
    width: 160, 
    height: 160, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3, 
    borderColor: '#fff',
    marginTop: 50,
  },
});

// Exporting styles, header styles, and back button component
/* export const headerStyle = {
  headerShown: true,
  headerStyle: { backgroundColor: '#00AAA3' },
  headerTintColor: 'white',
  headerTitle: '',
}; */

export const headerHome = {
  headerShown: true,
  headerStyle: { backgroundColor: '#fff' },
  headerTintColor: 'white',
  headerTitle: '',
};

export const backButton = (navigation) => ({
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
      <Ionicons name="chevron-back" size={24} color="white" />
    </TouchableOpacity>
  ),
});

export default styles;
