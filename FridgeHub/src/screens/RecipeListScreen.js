import React, { useState, useEffect, useCallback, useContext } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import RecipeCard from "../components/RecipeCard";
import axiosInstance from "../../axiosInstance";
import FavoriteScreen from "./FavoriteScreen";
import { useIsFocused } from "@react-navigation/native";

const RecipeListScreen = () => {
  const [username, setUsername] = useState("");
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused();

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/v1/user", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

      const userData = response.data.data;

      if (userData) setUsername(userData.username);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchRecipeData = useCallback(async () => {
    try {
      const result = await axiosInstance.get("/api/v1/recipe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.data) {
        setData(result.data.data);
      } else {
        // console.log('La structure de données attendue n\'est pas là. Voici le résultat complet :');
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données",
        error
      );
    }
  }, [token]);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/v1/favorite", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setFavorites(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch favorites: ", err);
    }
  }, [token]);

  const deleteFavorite = useCallback(
    async (favoriteId) => {
      try {
        const response = await axiosInstance.delete(
          `/api/v1/favorite/${favoriteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          fetchFavorites();
        }
      } catch (err) {
        console.error("Failed to delete favorite: ", err);
      }
    },
    [token, fetchFavorites]
  );

  const addFavorite = useCallback(
    async (recipe) => {
      try {
        const response = await axiosInstance.post(
          "/api/v1/favorite",
          { recipeId: recipe._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          fetchFavorites();
        }
      } catch (err) {
        console.error("Failed to add favorite: ", err);
      }
    },
    [token, fetchFavorites]
  );

  useEffect(() => {
    if (isFocused) {
      fetchUserDetails();
      fetchRecipeData();
      fetchFavorites();
    }
  }, [isFocused, fetchUserDetails, fetchRecipeData, fetchFavorites]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <Header headerText={`${username}`} />
        <SearchFilter />
        <FavoriteScreen
          favorites={favorites}
          addFavorite={addFavorite}
          deleteFavorite={deleteFavorite}
          isDisplayingHorizontal={true}
        />
        <RecipeCard
          recipeData={data}
          favorites={favorites}
          addFavorite={addFavorite}
          deleteFavorite={deleteFavorite}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeListScreen;
