import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../axiosInstance";
import {
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import chronocook from "../../assets/images/choronocook.png";
import { Dimensions } from "react-native";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const RecipeCard = ({ favorites = [], addFavorite, deleteFavorite }) => {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get("/api/v1/recipe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Met à jour l'état des données avec l'information des favoris
        const updatedData = result.data.data.map((item) => ({
          ...item,
          isFavorite: isFavorite(item._id),
        }));
        setData(updatedData);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération des données"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, favorites]); // Dépendances pour rafraîchir les données

  const isFavorite = (recipeId) => {
    return favorites.some((favorite) => favorite.recipeId === recipeId);
  };

  const handleFavoritePress = async (item) => {
    setIsButtonPressed(true);
    try {
      if (isFavorite(item._id)) {
        await deleteFavorite(item._id);
        // Update prior state correctly to reflect favorite status
        setData((priorData) =>
          priorData.map((recipe) =>
            recipe._id === item._id ? { ...recipe, isFavorite: false } : recipe
          )
        );
      } else {
        await addFavorite(item);
        // Update prior state correctly to reflect favorite status
        setData((priorData) =>
          priorData.map((recipe) =>
            recipe._id === item._id ? { ...recipe, isFavorite: true } : recipe
          )
        );
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout ou de la suppression du favori"
      );
    } finally {
      setIsButtonPressed(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ paddingTop: 40 }}>
      <Text
        style={{
          paddingHorizontal: 16,
          fontSize: 22,
          fontWeight: "bold",
          color: "#2A4859",
        }}
      >
        Recettes
      </Text>
      <FlatList
        padding={16}
        paddingTop={35}
        data={data}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        paddingVertical={16}
        marginVertical={-15}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              !isButtonPressed && navigation.navigate("RecipeDetail", { item })
            }
            style={{
              backgroundColor: "#F5F5F5",
              shadowColor: "darkgrey",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.8,
              shadowRadius: 8,

              marginTop: 80,
              borderRadius: 26,
              elevation: 9,
              width: (width - 48) / 2,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 8,
                marginTop: -75,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  height: 150,
                  resizeMode: "contain",
                }}
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 8, top: 8 }}
                onPress={() => handleFavoritePress(item)}
                disabled={isButtonPressed}
              >
                <Ionicons
                  name={item.isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color="#2A4859"
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: "#2A4859",
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingHorizontal: 8,
                }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 4,
                  paddingBottom: 8,
                }}
              >
                <Text
                  style={{ fontWeight: "bold", color: "#2CD9BE", fontSize: 16 }}
                >
                  {item.totalTime} min
                </Text>
                <Image
                  source={chronocook}
                  style={{ width: 20, height: 20, resizeMode: "contain" }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default RecipeCard;
