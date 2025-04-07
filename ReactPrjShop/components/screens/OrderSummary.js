
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Context } from '../globalContext/globalContext.js';

const OrderSummary = ({ route, navigation }) => {
  const order = route.params?.order;
  const order_items = route.params?.order_items;
  const globalContext = useContext(Context);
  const { domain } = globalContext;
  
  console.log("order_items -------", order_items);

  if (!order) {
    return (
      <LinearGradient colors={['#f9adbd', '#ffe3ed']} style={styles.container}>
        <View style={styles.headerContainer}>
          <Ionicons name="receipt" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.header}>Order Summary</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No order data available.</Text>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.submitText}>Back to Home</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f9adbd', '#ffe3ed']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="receipt" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.header}>Order Summary</Text>
      </View>

      {/* Display Order Items */}
      {order_items && order_items.length > 0 ? (
        <FlatList
          data={order_items}
          keyExtractor={(item) => item.flower_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.image ? `${domain}${item.image}` : 'https://via.placeholder.com/80' }} 
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name || 'Unnamed Item'}</Text>
                <Text style={styles.price}>${parseFloat(item.price || 0).toFixed(2)}</Text>
                <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No items found in this order.</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.summaryContainer}>
  {/* Title */}
  <Text style={styles.summaryTitle}>Order Summary</Text>

  {/* Order Details */}
  <Text style={styles.summaryText}>Customer: {order.order.customer_name || 'N/A'}</Text>
  <Text style={styles.summaryText}>Address: {order.order.address || 'N/A'}</Text>
  <Text style={styles.summaryText}>Phone: {order.order.phone || 'N/A'}</Text>
  <Text style={styles.summaryText}>Email: {order.order.email || 'N/A'}</Text>
  <Text style={styles.summaryText}>Total: ${parseFloat(order.order.total_price || 0).toFixed(2)}</Text>
</View>

      <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.submitText}>Back to Home</Text>
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
  icon: {
    marginRight: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
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
    fontSize: 16,
    color: 'gray',
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
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333', 
  }
});

export default OrderSummary;
