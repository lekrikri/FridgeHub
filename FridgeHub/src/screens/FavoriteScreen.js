import React, { useState, useContext, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axiosInstance from "../../axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import chronocook from "../../assets/images/choronocook.png";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const FavoriteScreen = ({ isDisplayingHorizontal }) => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const [isListEmpty, setIsListEmpty] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/v1/favorite", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        const favoriteData = response.data.data;

        const recipeDetailsPromises = favoriteData.map((favorite) =>
          axiosInstance
            .get(`/api/v1/recipe/${favorite.recipeId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .catch((err) => {
              console.error("Failed to fetch recipe details: ", err);
              return null;
            })
        );

        const recipesDetails = await Promise.all(recipeDetailsPromises);

        const combinedFavorites = favoriteData
          .map((favorite, index) => ({
            ...favorite,
            recipe: recipesDetails[index]?.data?.data || {},
          }))
          .filter((fav) => fav.recipe);

        setIsListEmpty(response.data.data.length === 0);
        setFavorites(combinedFavorites);
        setError(null);
      } else {
        setError("Erreur lors de la récupération des favoris.");
      }
    } catch (err) {
      console.error("Failed to fetch favorites: ", err);
      setError("Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      await axiosInstance.delete(`/api/v1/favorite/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites((prevFavorites) => {
        const updatedFavorites = prevFavorites.filter(
          (favorite) => favorite._id !== favoriteId
        );
        setIsListEmpty(updatedFavorites.length === 0);
        return updatedFavorites;
      });
    } catch (err) {
      console.error("Failed to delete favorite: ", err);
      setError("Failed to delete favorite. Please try again.");
    }
  };

  const EmptyListComponent = () => {
    if (!isDisplayingHorizontal) {
      return (
        <View style={styles.emptyListContainer}>
          <Image
            style={{
              height: 300,
              width: 300,
              position: "absolute",
              left: -135,
              top: -20,
              transform: [{ rotate: "90deg" }],
            }}
            source={require("../../assets/images/easy.png")}
          />
          <Text style={styles.emptyListText}>
            Vous avez un coup de cœur pour une recette ? Retrouvez-la ici en
            cliquant simplement sur l'icône en forme de coeur sur la recette.
          </Text>
          <Ionicons
            name={"heart"}
            size={24}
            color="#2A4859"
            alignSelf={"center"}
            padding={16}
          />
          <Image
            style={{
              height: 300,
              width: 300,
              position: "absolute",
              right: -100,
              bottom: 0,
              transform: [{ rotate: "-90deg" }],
            }}
            source={require("../../assets/images/choronocook.png")}
          />
        </View>
      );
    }
    return null;
  };

  const renderVerticalFavoriteItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("RecipeDetail", { item: item.recipe })}
      style={styles.favoriteCard(index)}
    >
      <Image source={{ uri: item.recipe.image }} style={styles.favoriteImage} />
      <Text style={styles.recipeTitle}>{item.recipe.title}</Text>
      <Text numberOfLines={1} style={styles.recipeDescription}>
        {item.recipe.description}
      </Text>
      <View style={styles.bottomRowContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeTitle}>{item.recipe.totalTime} min</Text>
          <Image source={chronocook} style={styles.timeImage} />
        </View>
        <TouchableOpacity onPress={() => handleDeleteFavorite(item._id)}>
          <Ionicons name={"heart"} size={24} color="#2A4859" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalFavoriteItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("RecipeDetail", { item: item.recipe })}
      style={{
        backgroundColor: index % 2 == 0 ? "#2CD9BE" : "#FCA721",
        shadowColor: "darkgrey",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.7,
        borderRadius: 10,
        marginTop: 32,
        marginRight: 32,
        padding: 10,
        width: width * 0.85,
      }}
    >
      <Image source={{ uri: item.recipe.image }} style={styles.favoriteImage} />
      <Text style={styles.recipeTitle}>{item.recipe.title}</Text>
      <Text numberOfLines={1} style={styles.recipeDescription}>
        {item.recipe.description}
      </Text>
      <View style={styles.bottomRowContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeTitle}>{item.recipe.totalTime} min</Text>
          <Image source={chronocook} style={styles.timeImage} />
        </View>
        <TouchableOpacity onPress={() => handleDeleteFavorite(item._id)}>
          <Ionicons name={"heart"} size={24} color="#2A4859" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      {isDisplayingHorizontal && favorites.length > 0 && (
        <Text style={styles.favorisHeader}>Favoris</Text>
      )}
      {isListEmpty && <EmptyListComponent />}
      {favorites.length > 0 && (
        <FlatList
          height={isDisplayingHorizontal ? 160 : "100%"}
          horizontal={isDisplayingHorizontal}
          padding={isDisplayingHorizontal ? 0 : 16}
          paddingRight={32}
          data={[...favorites].reverse()}
          renderItem={
            isDisplayingHorizontal
              ? renderHorizontalFavoriteItem
              : renderVerticalFavoriteItem
          }
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: isDisplayingHorizontal ? 16 : 8,
            paddingLeft: isDisplayingHorizontal ? 16 : 0,
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  infoContainer: {
    flexDirection: "column",
    padding: 8,
  },
  favorisHeader: {
    paddingTop: 32,
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A4859",
  },
  favoriteCard: (index) => ({
    backgroundColor: index % 2 == 0 ? "#2CD9BE" : "#FCA721",
    shadowColor: "darkgrey",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    borderRadius: 10,
    marginVertical: 16,
    padding: 10,
  }),
  favoriteImage: {
    position: "absolute",
    right: -18,
    top: -40,
    width: 100,
    height: 100,
  },
  recipeTitle: {
    color: "#F5F5F5",
    fontSize: 18,
    fontWeight: "900",
  },
  recipeDescription: {
    width: "70%",
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeTitle: {
    fontWeight: 600,
    color: "#F5F5F5",
    fontSize: 18,
  },
  timeImage: {
    width: 30,
    height: 30,
  },
  emptyListContainer: {
    height: "100%",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 16,
    color: "#2A4859",
  },
});

export default FavoriteScreen;
