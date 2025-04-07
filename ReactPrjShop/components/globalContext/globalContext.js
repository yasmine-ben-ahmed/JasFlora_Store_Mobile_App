import React, { useState, createContext } from "react";
import * as SecureStore from 'expo-secure-store'; // Make sure to import SecureStore
import axios from 'axios';

const Context = createContext();



//const [domain, setDomain] = useState("http://192.168.1.20:8000"); //wifi Ariana's house
const Provider = ({ children }) => {
  const [domain, setDomain] = useState("http://192.168.1.9:8000");  //wifi RasJebal's house
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientObj, setClientObj] = useState();
  const [token, setToken] = useState(null); // Add token state
  const [refreshToken, setRefreshToken] = useState(null); // Add refresh token state
  const [favorites, setFavorites] = useState([]);

  const saveToken = async (token) => {
    await SecureStore.setItemAsync('token', token);
  };

  const saveRefreshToken = async (refreshToken) => {
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${domain}/api/token/refresh/`, {
        refresh: refreshToken, // Send the refresh token
      });

      const newAccessToken = response.data.access;
      setToken(newAccessToken); // Update the stored access token
      await saveToken(newAccessToken); // Optionally save it
    } catch (error) {
      console.error("Error refreshing token:", error.response ? error.response.data : error.message);
      setIsLoggedIn(false); // Log out if refresh fails
    }
  };

  const globalContext = {
    domain,
    setDomain,
    isLoggedIn,
    setIsLoggedIn,
    clientObj,
    setClientObj,
    saveToken,
    saveRefreshToken,
    refreshAccessToken,
    token,
    setToken,
    refreshToken,
    setRefreshToken,
    favorites,
    setFavorites,
  };

  return <Context.Provider value={globalContext}>{children}</Context.Provider>;
};

export { Context, Provider };
