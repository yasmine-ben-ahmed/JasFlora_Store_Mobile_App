import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../globalContext/globalContext.js';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Cart = ({ route, navigation }) => {
  const { flowerId } = route.params || {}; 
  const [cart, setCart] = useState([]);
  const globalContext = useContext(Context);
  const { clientObj, domain } = globalContext;
  const [flowers, setFlowers] = useState([]);

  // Fetch the flower data when the component mounts
  useEffect(() => {
    fetch(`${domain}/auth/flowers/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => setFlowers(data.flowers))
      .catch((error) => console.error('Error fetching data:', error));
  }, [domain]);

  // Add the flower to the cart once flowers are loaded and flowerId is available
  useEffect(() => {
    if (flowers.length > 0 && flowerId) {
      // Check if the flowerId already exists in the cart before calling addToCart
      const flowerInCart = cart.find((item) => item.id === flowerId);
      if (!flowerInCart) {
        addToCart(flowerId);
      }
    }
  }, [flowers, flowerId, cart]); 

  // Load the cart from AsyncStorage on mount
  useEffect(() => {
    loadCart(); 
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const saveCart = async (updatedCart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  // Add or update flower in the cart
  const addToCart = (id) => {
    const flower = flowers.find((item) => item.id === id);
    if (flower) {
      const existingItem = cart.find((item) => item.id === id);
      let updatedCart;

      if (existingItem) {
        // If flower exists in the cart, update its quantity
        updatedCart = cart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Otherwise, add new flower with quantity 1
        updatedCart = [...cart, { ...flower, quantity: 1 }];
      }

      setCart(updatedCart);
      saveCart(updatedCart);
    }
  };

  // Remove flower from the cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleRemove = (id) => {
    Alert.alert('Remove Item', 'Do you want to remove this flower from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => removeFromCart(id) },
    ]);
  };

  // Update quantity of the flower in the cart
  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean); // Filter out any null values (items with 0 or negative quantity)

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  return (
    <LinearGradient colors={['#f9adbd', '#ffe3ed']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="cart" size={30} color="#fff" style={styles.cartIcon} />
        <Text style={styles.header}>Your Beautiful Selection 🌺</Text>
      </View>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is waiting to be filled with flowers! 🌺</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: `${domain}${item.image}` }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>${(Number(item.price) * (item.quantity || 1)).toFixed(2)}</Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                    <Text style={styles.quantityButton}>➖</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                    <Text style={styles.quantityButton}>➕</Text>
                  </TouchableOpacity>
                </View>
            
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.checkoutButton, cart.length === 0 && styles.disabledButton]}
        onPress={() => navigation.navigate('checkout', { cart })}
        disabled={cart.length === 0}
      >
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
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
  cartIcon: {
    marginRight: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginTop: 50,
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
  removeButton: {
    backgroundColor: '#e36084',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#e36084',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'space-between',
    width: 135,  
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginVertical: 5, 
    marginBottom: 20,
  },
  quantityButton: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#e36084',
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    minWidth: 30, 
  }
});

export default Cart;
