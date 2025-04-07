import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from "../globalContext/globalContext.js";
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = ({ navigation }) => {
  const globalContext = useContext(Context);
  const { clientObj, domain } = globalContext;

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
    return null; // Optionally add a loading spinner here
  }

  const handleEdit = () => {
    navigation.navigate('EditProfile');
  };

  const imageURL = clientObj.image
    ? `${domain}${clientObj.image.startsWith('/') ? '' : '/static'}${clientObj.image}`
    : 'https://via.placeholder.com/150';  // Fallback image if no image exists

  return (
    <LinearGradient colors={['#f9adbd', '#ffe3ed']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Section with Profile Image and Edit Button */}
        <View style={styles.topSection}>
          <View style={styles.imageContainer}>
            {clientObj.image ? (
              <Image source={{ uri: imageURL }} style={styles.profileImage} />
            ) : (
              <Icon name="user-circle" size={120} color="#e36084" />
            )}
          </View>
          {/* Edit Button */}
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Icon name="edit" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Section for Client Details */}
        <View style={styles.detailsContainer}>
  <Text style={styles.detailsTitle}>Profile Details</Text>
  
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Name:</Text>
    <Text style={styles.detailValue}>
      {clientObj.first_name} {clientObj.last_name}
    </Text>
  </View>

  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Email:</Text>
    <Text style={styles.detailValue}>{clientObj.email}</Text>
  </View>

  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Phone:</Text>
    <Text style={styles.detailValue}>{clientObj.phone}</Text>
  </View>

  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Address:</Text>
    <Text style={styles.detailValue}>{clientObj.address}</Text>
  </View>
</View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  imageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#e36084', // Add a border for the profile image
    marginBottom: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#e36084",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000', // Shadow for modern look
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsContainer: {
    
    
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    width: '100%',
  },
  detailLabel: {
    fontSize: 16,
    color: '#FFB6C1',
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
    flex: 1, // The label takes up some space
    marginRight: 20,
    marginLeft:30,
  },
  
  detailValue: {
    fontSize: 16,  // To match label font size
    marginBottom: 15, // Space between fields
    color: '#fff',
    flex: 2, // The value takes up remaining space
    textAlign: 'left', // Align text to the left
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center', // Aligns label and value vertically in the row
    marginBottom: 10, // Space between each row
  },
  

  
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFB6C1',
    marginBottom: 20,
  }
  
});

export default Profile;
