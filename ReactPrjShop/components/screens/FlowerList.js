import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Button,
} from 'react-native';
import { Context } from '../globalContext/globalContext.js';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const FlowerList = ({ route, navigation }) => {
  const { categoryId, query } = route.params || {};
  const [listFilteredFlowers, setListFilteredFlowers] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);  
  
  const [categories, setCategories] = useState([]);

  const globalContext = useContext(Context);
  const { clientObj, domain } = globalContext;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFlowerCart, setSelectedFlowerCart] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

    // Fetching flower data
    useEffect(() => {
      console.log('flowerList Fetching flower data...');
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
          //console.log('-----flowers',flowers);
          console.log('-----categories',categories);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);  // Set loading to false in case of error
        });
    }, []);

  // Handle search query change
  useEffect(() => {
    if (flowers.length > 0) {
      const filtered = flowers.filter((flower) =>
        flower.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setListFilteredFlowers(filtered);
    }
  }, [searchQuery, flowers]);  // Re-filter on search query change

  const handleSelectFlower = (flower) => {
    setSelectedFlower(flower);
  };

  const handleCloseModal = () => {
    setSelectedFlower(null);
  };

  const toggleFavorite = async (flower) => {
    const updatedFlowers = flowers.map((f) =>
      f.id === flower.id ? { ...f, isFavorite: !f.isFavorite } : f
    );

    setFlowers(updatedFlowers);

    let updatedFavorites;
    if (flower.isFavorite) {
      updatedFavorites = favorites.filter((id) => id !== flower.id);
    } else {
      updatedFavorites = [...favorites, flower.id];
    }

    setFavorites(updatedFavorites);
    console.log('******updatedFavorites',updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const loadFavorites = async () => {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    };

    loadFavorites();
  }, []);

  // Handling default query if passed in route
  useEffect(() => {
    if (route.params?.query) {
      setSearchQuery(route.params.query);
    }
  }, [route.params?.query]);

  const greeting = `Welcome, ${clientObj?.first_name || ''} ${
    clientObj?.last_name || 'Guest'
  }!`;
  const email = clientObj?.email || 'guest@example.com';
  const thinking = `Thank you for choosing our application.`;
  const imageURL = clientObj.image
    ? `${domain}${clientObj.image}`
    : 'https://via.placeholder.com/150';

  const handleAddToCart = (selectedFlower) => {
    navigation.navigate('Cart', { flowerId: selectedFlower.id });
  };

  // Reset category when the screen is navigated away
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setSelectedCategory(null);
        setListFilteredFlowers(flowers);
      };
    }, [flowers])
  );

  const handleCategoryPress = (categoryName) => {
    if (selectedCategory === categoryName) {
      // Deselect the category
      setSelectedCategory(null);
      setListFilteredFlowers(flowers); // Show all flowers
    } else {
      // Select a new category
      setSelectedCategory(categoryName);
      console.log('Selected Category:', categoryName);

      const category = categories.find((cat) => cat.name === categoryName);
      if (category) {
        const filteredFlowers = flowers.filter(
          (flower) => flower.categoryId === category.id
        );
        setListFilteredFlowers(filteredFlowers);
      } else {
        console.error('Category not found!');
      }
    }
  };

    

  return (
    <LinearGradient colors={['#f9adbd', '#ffe3ed']} style={styles.container}>
    <SafeAreaView style={styles.container}>

      <View style={styles.headerContainer}>
        <ImageBackground
          source={{ uri: imageURL }}
          style={styles.imageBackground}
          onError={(error) => console.log('Image Load Error:', error.nativeEvent)}
        />
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.thinking}>{thinking}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color="#888" />
        <TextInput
          placeholder="Search flowers"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
    
      </View>

       <View >
               {/* Browse by Category */}
       <Text style={styles.header}>Browse by Category</Text>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                item.name === selectedCategory && styles.selectedCategory,
              ]}
              onPress={() => handleCategoryPress(item.name)}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesContainer}
        />
        </View> 

      {loading ? (  // Loading state to show a spinner or text until flowers are fetched
        <Text>Loading flowers...</Text>
      ) : (
        <FlatList
          data={listFilteredFlowers}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectFlower(item)}
              style={styles.card}
            >
              <Image
                source={{ uri: `${domain}${item.image}` }}
                style={styles.cardImage}
                onError={(error) => console.log('Image Load Error:', error.nativeEvent)}
              />
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.favoriteButtonOutside}
                onPress={() => toggleFavorite(item)}
              >
                <Ionicons
                  name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                  size={30}
                  color={favorites.includes(item.id) ? '#ee5e90' : '#ddd'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      )}

      <TouchableOpacity
        style={styles.favoritesButton}
        onPress={() => navigation.navigate('Favorites', { favorites, flowers })}
      >
        <Text style={styles.favoritesButtonText}>View My Favorites</Text>
      </TouchableOpacity>

      {selectedFlower ? (
        <Modal
          visible={!!selectedFlower}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedFlower(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseModal}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Image source={{ uri: `${domain}${selectedFlower.image}` }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedFlower.name}</Text>
              <Text style={styles.modalCategory}>{selectedFlower.category}</Text>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => handleAddToCart(selectedFlower)}
              >
                <View style={styles.buttonContent}>
                  <Ionicons
                    name="cart-outline"
                    size={20}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text style={styles.viewMoreText}>Add to Cart</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe3ed',
  },
  topLeftButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#f9adbd",
  },
  imageBackground: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20, 
    
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardImage: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  favoriteButtonOutside: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  favoritesButton: {
    margin: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#e36084',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoritesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalCategory: {
    fontSize: 16,
    color: '#777',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  cartButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#ee5e90',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e36084',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    elevation: 3, 
    
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8, 
    
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8, // Space between icon and text
  },
  header: { fontSize: 18, marginLeft: 16, marginBottom: 8 },
  categoriesContainer: { paddingHorizontal: 16 ,marginBottom: 20},
  categoryItem: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: "#cdd0d5",
  },
  categoryText: { fontSize: 16 },
  
});

export default FlowerList;
