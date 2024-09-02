import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axiosInstance from "../../../axiosInstance";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const spacing = 16;
const cellWidth = (screenWidth - (numColumns + 1) * spacing) / numColumns;

const Ingredient = ({ ingredients }) => {
  const [ingredientsDetails, setIngredientsDetails] = useState([]);
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const isIngredientMissing = useCallback(
    (ingredientName) => {
      const missing = !pantryIngredients.some(
        (ingredient) => ingredient.ingredient_name === ingredientName
      );
      return missing;
    },
    [pantryIngredients]
  );

  const isInShoppingList = useCallback(
    (ingredientName) => {
      return shoppingList.includes(ingredientName);
    },
    [shoppingList]
  );

  const handleMissingIngredientClick = useCallback(async (ingredient) => {
    try {
      const existingShoppingList = await AsyncStorage.getItem("shoppingList");
      let shoppingList = existingShoppingList
        ? JSON.parse(existingShoppingList)
        : [];
      if (!shoppingList.includes(ingredient)) {
        shoppingList.push(ingredient);
      } else {
        shoppingList = shoppingList.filter((item) => item !== ingredient);
      }
      await AsyncStorage.setItem("shoppingList", JSON.stringify(shoppingList));
      setShoppingList(shoppingList); // Mettre à jour l'état shoppingList
    } catch (error) {
      console.error(
        `Failed to update ingredient in shopping list: ${ingredient}`,
        error
      );
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      if (item.empty) {
        return <View style={[styles.ingredientCell, styles.invisibleCell]} />;
      }
      return (
        <View style={styles.ingredientCell}>
          <Image
            style={styles.ingredientCellImage}
            source={{ uri: item.image }}
            onError={({ nativeEvent: { error } }) =>
              console.log("Failed to load ingredient image: ", error)
            }
          />
          {isIngredientMissing(item.name) && (
            <TouchableOpacity
              style={{ position: "absolute", right: 4, top: 4 }}
              onPress={() => handleMissingIngredientClick(item.name)}
            >
              <MaterialCommunityIcons
                name={isInShoppingList(item.name) ? "cart" : "cart-outline"}
                color="#FCA721"
                size={24}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.ingredientCellText}>
            {`${item.quantity} ${item.metric} ${item.name}`}
          </Text>
        </View>
      );
    },
    [token, pantryIngredients, isIngredientMissing, isInShoppingList]
  );

  useFocusEffect(
    useCallback(() => {
      const fetchShoppingList = async () => {
        const existingShoppingList = await AsyncStorage.getItem("shoppingList");
        setShoppingList(
          existingShoppingList ? JSON.parse(existingShoppingList) : []
        );
      };
      fetchShoppingList();
    }, [])
  );

  useEffect(() => {
    const fetchIngredientData = async () => {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
      if (storedToken === null) {
        // console.log('Token is null');
      }
      try {
        const res = await Promise.all(
          ingredients.map((ingredientData) =>
            axiosInstance.get(
              `/api/v1/ingredient/${ingredientData.ingredient}`,
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              }
            )
          )
        );
        const ingredientsRes = res.map((ingredientRes, index) => ({
          ...ingredientRes.data.data,
          quantity: ingredients[index].quantity,
          metric: ingredients[index].metric,
        }));

        const numFullRows = Math.floor(ingredientsRes.length / numColumns);
        let numElementsLastRow =
          ingredientsRes.length - numFullRows * numColumns;
        while (numElementsLastRow !== numColumns && numElementsLastRow !== 0) {
          ingredientsRes.push({
            key: `blank-${numElementsLastRow}`,
            empty: true,
          });
          numElementsLastRow++;
        }
        setIngredientsDetails(ingredientsRes);

        const pantryResponse = await axiosInstance.get(`/api/v1/pantry/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setPantryIngredients(pantryResponse.data.items);

        const existingShoppingList = await AsyncStorage.getItem("shoppingList");
        setShoppingList(
          existingShoppingList ? JSON.parse(existingShoppingList) : []
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching ingredient data:", error);
        setLoading(false);
      }
    };
    fetchIngredientData();
  }, [ingredients]);

  return (
    <View>
      <Image
        style={{
          height: 150,
          width: 150,
          position: "absolute",
          top: -75,
          right: -60,
          transform: [{ rotate: "-35deg" }],
        }}
        source={require("../../../assets/images/figo_open.png")}
      />
      <FlatList
        numColumns={3}
        data={ingredientsDetails}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing }} />}
      />
    </View>
  );
};

export default Ingredient;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  ingredientCell: {
    width: cellWidth,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: 100,
    backgroundColor: "rgb(223,239,234)",
    borderColor: "rgba(108,214,183,1)",
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
  },
  ingredientCellImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  ingredientCellText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  invisibleCell: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
});
