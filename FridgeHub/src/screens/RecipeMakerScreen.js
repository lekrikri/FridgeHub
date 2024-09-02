import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/core";
import axiosInstance from "../../axiosInstance";
import figoChef from "../../assets/images/figo_chef.png";
import toqueChef from "../../assets/images/toque_chef.png";

const screenWidth = Dimensions.get("window").width;
const cellMargin = 8;
const numColumns = 3;
const paddingHorizontal = 16;
const cellSize =
  (screenWidth - 2 * paddingHorizontal - (numColumns - 1) * cellMargin) /
  numColumns;

const RecipeMakerScreen = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generateClicked, setGenerateClicked] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPantryItems = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get("/api/v1/pantry");
          if (response.data && response.data.items) {
            const updatedPantryItems = await Promise.all(
              response.data.items.map(async (item) => {
                const ingredientDetails = await fetchIngredientDetails(
                  item.ingredient_name
                );
                return { ...item, ...ingredientDetails };
              })
            );
            setPantryItems(updatedPantryItems);
            setSelectedIngredients([]); // Mettre à jour selectedIngredients ici
          } else {
            console.log("Unexpected format in response: ", response);
          }
        } catch (error) {
          setError("Erreur lors de la récupération des ingrédients.");
        } finally {
          setLoading(false);
        }
      };

      fetchPantryItems();
    }, [])
  );

  const fetchIngredientDetails = async (ingredientName) => {
    try {
      const response = await axiosInstance.get(`/api/v1/ingredient/search`, {
        params: { query: ingredientName },
      });
      const ingredientDetail = response.data.data.find(
        (ingredient) => ingredient.name === ingredientName
      );
      return ingredientDetail ? ingredientDetail : {};
    } catch (error) {
      console.error(
        `Error while fetching ingredient details for ${ingredientName}`
      );
      return {};
    }
  };

  const handleItemSelect = (item) => {
    setSelectedIngredients((prevItems) => {
      if (prevItems.includes(item)) {
        return prevItems.filter((i) => i !== item);
      }
      return [...prevItems, item];
    });
  };

  const triggerGenerateRecipes = async () => {
    setLoading(true);
    setError(null);
    setGenerateClicked(true);
  };

  useEffect(() => {
    if (generateClicked) {
      // Nous réinitialisons les ingrédients sélectionnés même avant de commencer à générer les recettes.
      setSelectedIngredients([]);
      generateRecipes();
    }
  }, [pantryItems, generateClicked]);

  const generateRecipes = async () => {
    setLoading(true);
    setError(null);

    const selectedIngredientNames = pantryItems.map(
      (ingredient) => ingredient.ingredient_name
    );
    try {
      const response = await axiosInstance.post(
        "/api/v1/recipe/generate-recipes",
        {
          ingredients: selectedIngredientNames,
        }
      );

      if (response.data && response.data.success) {
        setGeneratedRecipes([response.data.data]);
      } else {
        setError("Erreur lors de la génération des recettes.");
      }
    } catch (error) {
      setError("Erreur lors de la génération des recettes.");
    } finally {
      setLoading(false);
      setGenerateClicked(false);
    }
  };

  const renderPantryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleItemSelect(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.ingredientCell, selectedIngredients.includes(item)]}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.ingredientCellImage}
          />
        ) : null}
        <Text style={styles.ingredientCellText}>{item.ingredient_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.recipeDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.containerImageBackground}>
        <ImageBackground
          source={require("../../assets/images/kitchen.png")}
          style={styles.imageBackground}
        />
      </View>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.topContainer}>
          <Image source={figoChef} style={styles.figoChefImage} />
          <View style={styles.speechBubbleContainer}>
            <Text style={styles.speechBubbleText}>
              Je vais t'aider à te créer des recettes en fonction des aliments
              de ton garde-manger.
            </Text>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#00796b" />
        ) : (
          <FlatList
            data={pantryItems}
            renderItem={renderPantryItem}
            numColumns={numColumns}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.flatListContent}
            ItemSeparatorComponent={() => (
              <View style={{ height: cellMargin / 3 }} />
            )}
          />
        )}
        <FlatList
          data={generatedRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.recipeList}
        />
        <View>
          <Image source={toqueChef} style={styles.toqueChefImage} />
          <TouchableOpacity
            onPress={triggerGenerateRecipes}
            style={styles.generateButton}
          >
            <Text style={styles.generateButtonText}>Générer des recettes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerImageBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  pantryItemImage: {
    width: 40,
    height: 40,
  },
  ingredientCell: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(223,239,234,0.79)",
    borderColor: "rgba(108,214,183,1)",
    borderRadius: 16,
    borderWidth: 1,
    margin: cellMargin / 3,
    width: cellSize,
    height: cellSize,
  },
  ingredientCellImage: {
    width: cellSize * 0.6,
    height: cellSize * 0.6,
    resizeMode: "contain",
    marginBottom: 4,
  },
  ingredientCellText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  safeAreaView: {
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  figoChefImage: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  speechBubbleContainer: {
    flex: 1,
    marginLeft: 5,
    justifyContent: "center",
    paddingHorizontal: 1,
    paddingVertical: 15,
  },
  speechBubbleText: {
    fontSize: 15,
    color: "rgb(11,16,24)",
    backgroundColor: "rgba(223,239,234,0.65)",
    borderColor: "rgba(108,214,183,1)",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    overflow: "hidden",
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  generateButton: {
    backgroundColor: "#2CD9BE",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    marginHorizontal: 16,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    height: 47,
    zIndex: 1,
  },
  generateButtonText: {
    color: "#F5F5F5",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  toqueChefImage: {
    width: 60, // Ajuste la taille de l'image si nécessaire
    height: 60,
    position: "absolute",
    right: 20,
    top: -112,
    transform: [{ rotate: "0deg" }],
    zIndex: 0,
  },
  recipeCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginHorizontal: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#555",
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
});

export default RecipeMakerScreen;
