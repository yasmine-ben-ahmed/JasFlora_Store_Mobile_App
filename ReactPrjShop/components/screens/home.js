import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Animated, Image, Button, ImageBackground } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const Home = ({ route, navigation }) => {
  const globalContext = useContext(Context);
  const { clientObj, domain } = globalContext;
  const [contactMessage, setContactMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const {  setFavorites } = useContext(Context);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [categories, setCategories] = useState([]);


    // Fetching flower data
    useEffect(() => {
      console.log('Fetching flower data...');
      fetch(`${domain}/auth/flowers/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          //.log('Data fetched successfully',data);
          setFlowers(data.flowers);
          setLoading(false);  // Set loading to false once data is fetched
          setCategories(data.categories);
         // console.log('-----flowers',flowers);
          //console.log('-----categories',categories);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);  // Set loading to false in case of error
        });
    }, []);
  


  // Testimonials
  const testimonials = [
    { id: '1', text: "The flowers are gorgeous and arrived fresh! Highly recommend!", name: "Sarah J." },
    { id: '2', text: "A great shopping experience. Beautiful arrangements and quick delivery!", name: "Med T." },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Clear search input when coming back to this screen
  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
    }, [])
  );

  // Load favorites when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const savedFavorites = await AsyncStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));  // Update context with saved favorites
        }
      };

      loadFavorites();
    }, [setFavorites])
  );







  const imageURL = clientObj.image 
    ? (clientObj.image.startsWith('/') ? `${domain}${clientObj.image}` : clientObj.image)
    : 'https://via.placeholder.com/150';
  


  return (


    <View style={{ flex: 1, backgroundColor: '#fff6f8' }}>
      <LinearGradient colors={[ '#ffe3ed','#ffe3ed']} style={styles.container}>
 
    <FlatList
    
      data={[
        {
          type: 'header',
          greeting: `Welcome, ${clientObj?.first_name || ''} ${clientObj?.last_name || 'Guest'}!`,
          email: clientObj?.email || 'guest@example.com',
          thinking: `Thank you for choosing our application.`,
          image: imageURL,
        },
        
        {
          type: 'searchBar',
        },
        {
          type: 'aboutUs',
        },
        {
          type: 'featuredSection',
        },
        {
          type: 'testimonialSection',
          data: testimonials,
        },
        {
          type: 'contactUs',
        },
      ]}
      renderItem={({ item }) => {
        switch (item.type) {
          case 'header':
            return (
              <View style={styles.headerContainer}>
                <ImageBackground
                  source={{
                    uri: item.image
                      ? item.image
                      : 'https://via.placeholder.com/150',
                  }}
                  style={styles.imageBackground}
                  onError={(error) =>
                    console.log('Image Load Error:', error.nativeEvent)
                  }
                />
                <View style={styles.textContainer}>
                  <Text style={styles.greeting}>{item.greeting}</Text>
                  <Text style={styles.email}>{item.thinking}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
              </View>
            );
          
                   
            case 'searchBar':
              return (
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={24} color="#888" />
                  <TextInput
                    placeholder="Search flowers"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={(text) => {
                      let typingTimeout 
                      setSearchQuery(text); 
                      if (typingTimeout) {
                        clearTimeout(typingTimeout); 
                      }
            
                      
                      typingTimeout = setTimeout(() => {
                        if (text.trim()) {
                          navigation.navigate('FlowerList', { query: text.trim() }); 
                        }
                      }, 3000);
                    }}
                  />
                </View>
              );
            
            
          case 'aboutUs':
            return (
              <View style={styles.aboutUsSection}>
                <Text style={styles.aboutUsTitle}>About JasFlora</Text>
                <Text style={styles.aboutUsText}>
                  At JasFlora, we believe that flowers are a beautiful way to express
                  feelings and bring joy. We offer a wide variety of fresh and vibrant
                  flowers for every occasion, with fast and reliable delivery.
                </Text>
              </View>
            );
            
              
                      
          case 'featuredSection':
            return (
              <View style={styles.cardq}>
              <Image source={require('../../assets/flowers.jpg')} style={styles.imageq} />

              <Text style={styles.quote}>
                "Flowers always make people better, happier, and more helpful."
              </Text>
              <TouchableOpacity style={styles.buttonq} onPress={() => navigation.navigate('FlowerList')}>
                <Text style={styles.buttonTextq}>Explore Flowers</Text>
              </TouchableOpacity>
            </View>
            );

          case 'testimonialSection':
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Customer Reviews</Text>
                <FlatList
                  data={item.data}
                  renderItem={({ item }) => (
                    <View style={styles.testimonialCard}>
                      <Text style={styles.testimonialText}>“{item.text}”</Text>
                      <Text style={styles.testimonialAuthor}>- {item.name}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.cardContainer}
                  nestedScrollEnabled
                />
              </View>
            );
          case 'contactUs':
            return (
              <View style={styles.contactUsSection}>
                <Text style={styles.contactUsTitle}>Contact Us</Text>
                <Text style={styles.contactUsText}>
                  For inquiries, please email us at: support@yasflorastore.com
                </Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Write a message"
                  multiline
                  value={contactMessage}
                  onChangeText={setContactMessage}
                />
                <TouchableOpacity style={styles.sendButton}>
                  <Text style={styles.sendButtonText}>Send Message</Text>
                </TouchableOpacity>
              </View>
            );
          default:
            return null;
        }
      }}
      keyExtractor={(item, index) => index.toString()}
    />
</LinearGradient>
</View>

  );
  
  
  
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Align items vertically in the center
    padding: 10,
    backgroundColor: '#f9adbd', // Add some padding
    borderBottomWidth: 1,  // Add a bottom border
    borderBottomColor: '#fff',  // Set color of the bottom border
  },
  
  imageBackground: {
    width: 100, // Adjust width for the image
    height: 100, // Adjust height for the image
    borderRadius: 10, // Optional: rounded corners
    overflow: 'hidden', // Ensure content fits within rounded corners
  },
  textContainer: {
    flex: 1, // Take up remaining space
    marginLeft: 10, // Add space between image and text
    justifyContent: 'center', // Center text vertically
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  aboutUsSection: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  aboutUsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  aboutUsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  cardContainer: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    elevation: 5, // Add shadow on Android
    shadowColor: '#000', // Add shadow on iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  testimonialCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  testimonialText: {
    fontSize: 16,
    color: '#333',
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  contactUsSection: {
    backgroundColor: '#f9adbd',
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  contactUsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  contactUsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  messageInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#e36084',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cardq: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  imageq: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonq: {
    backgroundColor: '#e36084',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonTextq: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Home;
