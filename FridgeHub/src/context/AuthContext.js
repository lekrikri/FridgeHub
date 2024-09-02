import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem("token");
        console.log("Token from AsyncStorage: ", userToken); // Utilisez le console.log pour déboguer
        if (userToken) {
          setIsAuthenticated(true);
          setToken(userToken);
        }
      } catch (error) {
        console.error("Error loading token from AsyncStorage", error);
      }
    };
    bootstrapAsync();
  }, []);

  // Afficher le token dans les logs peut être utile pour le débogage, mais pensez à le retirer en production
  console.log("Token in state: ", token);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, token, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
