import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import styles from "../styles/styles.js";

function Landing({ navigation }) {
  const globalContext = useContext(Context);

  return (
    <View style={styles.outerPage}>
      {/* <Image source={LoginIcon} style={{ width: 300, height: 300 }} /> */}
      <Text style={{    fontSize: 34, fontWeight: 'bold',textAlign: "center", width: "100%",}}>Welcome, Client !</Text>

      <TouchableOpacity
        style={[styles.landingpage, { marginTop: 80 }]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ fontWeight: 'bold', color:"#666"}}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.landingpage, { marginTop: 25 }]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={{ fontWeight: 'bold', color:"#666"}}>Sign Up</Text>
      </TouchableOpacity>


    </View>
  );
}

export default Landing;
