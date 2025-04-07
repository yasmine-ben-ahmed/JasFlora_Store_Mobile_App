import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Cart from '../screens/cart';
import Profile from '../screens/profile';
import Home from '../screens/home';
import Favorites from '../screens/favorites';
import FlowerList from '../screens/FlowerList'; // Ensure this file and export exist
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let size = 30;
          if (route.name === 'Cart') {
            return <Ionicons name="cart-outline" size={size} color={color} />;
          } else if (route.name === 'HOme') {
            return <Ionicons name="home-outline" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name="person-outline" size={size} color={color} />;
          } else if (route.name === 'Favorites') {
            return <MaterialIcons name="favorite-outline" size={size} color={color} />;
          } else if (route.name === 'FlowerList') {
            return <Ionicons name="list-outline" size={size} color={color} />;
          }
          
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarInactiveTintColor: '#666',
        tabBarActiveTintColor: '#e36084',
      })}
    >
      <Tab.Screen name="HOme" component={Home} />
      <Tab.Screen name="FlowerList" component={FlowerList} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
