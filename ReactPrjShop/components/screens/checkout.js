import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { Context } from '../globalContext/globalContext.js';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Checkout = ({ route, navigation }) => {
  const { cart } = route.params;
  const globalContext = useContext(Context);
  const { clientObj, domain } = globalContext;

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);

  const totalPrice = Array.isArray(cart) && cart.length > 0
  ? cart.reduce((acc, item) => {
      const itemTotal = parseFloat(item.price) * (item.quantity || 1);
      return acc + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0)
  : 0;


  const submitOrder = async () => {
    if (!address || !phone || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const orderItems = cart.map(item => ({
      flower_id: item.id,
      name: item.name || "Unknown Flower",  
      image: item.image || "https://via.placeholder.com/80",  
      quantity: item.quantity || 1,
      price: parseFloat(item.price || 0).toFixed(2),
    }));
    const orderData = {
      customer_name: clientObj ? `${clientObj.first_name} ${clientObj.last_name}` : "Guest User",
      address,
      phone,
      email,
      total: cart.reduce((sum, item) => {
        const itemTotal = parseFloat(item.price || 0) * (item.quantity || 1);
        return sum + (isNaN(itemTotal) ? 0 : itemTotal);
      }, 0).toFixed(2), 
      order_items: orderItems,  
    };
    
    try {
      const response = await fetch(`${domain}/auth/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Your order has been placed!');
        navigation.navigate('OrderSummary', { order: data, order_items: orderItems });
        setOrderStatus('success');
      } else {
        Alert.alert('Order Failed', data.message || 'Something went wrong');
        setOrderStatus('failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not complete order');
      setOrderStatus('failed');
    }
  };

  return (
    <LinearGradient colors={['#f9adbd', '#ffe3ed']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="cart" size={30} color="#fff" style={styles.cartIcon} />
        <Text style={styles.header}>Ready to Checkout?</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image 
              source={{ uri: item.image ? `${domain}${item.image}` : 'https://via.placeholder.com/80' }} 
              style={styles.image} 
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
              <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.total}>Total: ${(item.quantity * parseFloat(item.price)).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.divider} />

      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Enter Your Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.summaryContainer}>
  <Text style={styles.summaryTitle}>Order Summary</Text>
  {cart.map(item => (
    <Text key={item.id} style={styles.summaryText}>
      {item.name} x {item.quantity} - ${(parseFloat(item.price) * item.quantity).toFixed(2)}
    </Text>
  ))}
  <Text style={styles.summaryTitle}>Total: ${totalPrice.toFixed(2)}</Text>
</View>


      <TouchableOpacity style={styles.submitButton} onPress={submitOrder}>
        <Text style={styles.submitText}>Confirm Order</Text>
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
    marginTop: 30,
  },
  cartIcon: {
    marginRight: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: 'green',
  },
  quantity: {
    fontSize: 14,
    color: '#777',
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  summaryContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
    
  },
  submitButton: {
    backgroundColor: '#e36084',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333', 
  }
});

export default Checkout;
