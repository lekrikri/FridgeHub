import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../axiosInstance";
import beefImage from "../../assets/images/ingredients/beef.png";
import { useFocusEffect } from "@react-navigation/native";

export default function ShoppingListScreen() {
  const [shoppingListItems, setShoppingListItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListEmpty, setIsListEmpty] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const storedShoppingList = await AsyncStorage.getItem("shoppingList");
    if (storedShoppingList) {
      const items = JSON.parse(storedShoppingList);

      const newItems = await Promise.all(
        items.map(async (ingredientName) => {
          const response = await axiosInstance.get(
            `/api/v1/ingredient/search`,
            {
              params: { query: ingredientName },
            }
          );

          const matchingIngredient = response.data.data.find(
            (ingredient) => ingredient.name === ingredientName
          );

          const ingredientImage =
            matchingIngredient && matchingIngredient.image
              ? matchingIngredient.image
              : null;

          return {
            ingredientName: ingredientName,
            image: ingredientImage,
            isSelected: false,
          };
        })
      );
      setShoppingListItems(newItems);
      setIsListEmpty(newItems.length === 0); // Mettre à jour l'état isListEmpty
    } else {
      setShoppingListItems([]);
      setIsListEmpty(true); // Mettre à jour l'état isListEmpty
    }
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const EmptyListComponent = () => (
    <View style={styles.emptyListContainer}>
      <Image
        style={{
          height: 250,
          width: 250,
          position: "absolute",
          alignSelf: "center",
          top: -62,
          transform: [{ scaleY: -1 }],
        }}
        source={require("../../assets/images/figo_trucs_astuces.png")}
      />
      <Text style={styles.emptyListText}>
        Votre liste de courses est vide. Vous pouvez ajouter vos ingrédients
        directement depuis les détails des recettes.
      </Text>
      <Image
        style={{
          height: 300,
          width: 300,
          position: "absolute",
          alignSelf: "center",
          bottom: -130,
        }}
        source={require("../../assets/images/hard.png")}
      />
    </View>
  );

  // const handleDeleteItem = async (index) => {
  //   let newShoppingListItems = [...shoppingListItems];
  //   newShoppingListItems.splice(index, 1);
  //   setShoppingListItems(newShoppingListItems);
  //   setIsListEmpty(newShoppingListItems.length === 0); // Mettre à jour l'état isListEmpty
  //   await AsyncStorage.setItem(
  //     "shoppingList",
  //     JSON.stringify(newShoppingListItems)
  //   );
  // };

  const handleDeleteItem = async (index) => {
    let newShoppingListItems = [...shoppingListItems];
    newShoppingListItems.splice(index, 1);
    setShoppingListItems(newShoppingListItems);
    setIsListEmpty(newShoppingListItems.length === 0); // Mettre à jour l'état isListEmpty
    const updatedShoppingList = newShoppingListItems.map(
      (item) => item.ingredientName
    );
    await AsyncStorage.setItem(
      "shoppingList",
      JSON.stringify(updatedShoppingList)
    );
  };

  const resetShoppingList = async () => {
    setShoppingListItems([]);
    setIsListEmpty(true); // Mettre à jour l'état isListEmpty
    await AsyncStorage.setItem("shoppingList", JSON.stringify([]));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isListEmpty && <EmptyListComponent />}
      {!isListEmpty && (
        <>
          <FlatList
            data={shoppingListItems}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }} // Ajoutez paddingBottom ici
            showsVerticalScrollIndicator={true}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.itemContent}>
                  <View style={styles.itemImageContainer}>
                    <Image
                      source={item.image ? { uri: item.image } : beefImage}
                      style={styles.itemImage}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailsItemContainer}>
                      <Text style={styles.itemText}>{item.ingredientName}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteItem(index)}
                  style={styles.trashButton}
                >
                  <Ionicons name="trash-outline" size={30} color="#2A4859" />
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetShoppingList}
            >
              <Text style={styles.resetText}>Effacer tout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    height: 70,
    gap: 16,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#E0F1EB",
    borderRadius: 10,
    padding: 8,
  },
  itemImageContainer: {
    padding: 4,
    backgroundColor: "#E0F1EB",
    borderColor: "#2CD9BE",
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: "center",
  },
  itemImage: {
    width: 54,
    height: 54,
    resizeMode: "contain",
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 8,
  },
  detailsItemContainer: {
    gap: 4,
  },
  containerAction: {
    flexDirection: "row",
    gap: 24,
  },
  itemText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
    color: "#2A4859",
  },
  checkmarkButton: {},
  trashButton: {},
  resetButton: {
    backgroundColor: "orange",
    height: 47,
    borderRadius: 10,
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center",
    bottom: 16,
    left: 16,
    right: 16,
  },
  resetText: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 8,
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
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 16,
  },
});
