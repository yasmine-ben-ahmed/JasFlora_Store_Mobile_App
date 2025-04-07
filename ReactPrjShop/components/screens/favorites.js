import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Context } from '../globalContext/globalContext.js';
import { LinearGradient } from 'expo-linear-gradient';

const Favorites = ({ navigation }) => {
  const [flowers, setFlowers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const globalContext = useContext(Context);
  const { domain } = globalContext;

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${domain}/auth/flowers/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setFlowers(data.flowers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowers();
  }, [domain]);

  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
          const favoriteFlowers = flowers.filter((flower) => favoriteIds.includes(flower.id));
          setFavorites(favoriteFlowers);
        } catch (err) {
          console.error('Error loading favorites:', err);
        }
      };

      loadFavorites();
    }, [flowers])
  );

  const toggleFavorite = async (flower) => {
    const isFavorite = favorites.some((fav) => fav.id === flower.id);
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== flower.id);
    } else {
      updatedFavorites = [...favorites, flower];
    }

    const favoriteIds = updatedFavorites.map((fav) => fav.id);
    await AsyncStorage.setItem('favorites', JSON.stringify(favoriteIds));
    setFavorites(updatedFavorites);
  };

  const handleAddToCart = (selectedFlower) => {
    navigation.navigate('Cart', { flowerId: selectedFlower.id });
  };
  
  const addToCart = async (flower) => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      const cart = storedCart ? JSON.parse(storedCart) : [];
      if (!cart.some((item) => item.id === flower.id)) {
        const updatedCart = [...cart, flower];
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        Alert.alert('Added to Cart', `${flower.name} has been added to your cart!`);
      } else {
        Alert.alert('Already in Cart', `${flower.name} is already in your cart.`);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#e95f9f" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f9adbd', '#ffe3ed']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="heart" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.header}>Your Favorite Blooms </Text>
      </View>

      {error && <Text style={styles.error}>Error: {error}</Text>}

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: `${domain}${item.image}` }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                  <Ionicons name="heart" size={24} color="red" />
                </TouchableOpacity>
            {/* Add to Cart Button */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => handleAddToCart(item)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="cart-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </View>
            </TouchableOpacity>



              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorite flowers yet.</Text>}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: 'green',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartButton: {
    backgroundColor: '#e36084',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginTop: 50,
  },
});

export default Favorites;