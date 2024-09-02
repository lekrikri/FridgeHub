import React, { useState, useEffect, forwardRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import axiosInstance from "../../axiosInstance";
import { useFocusEffect } from "@react-navigation/native";

export default function PantryScreen({ navigation }) {
  const [ingredients, setIngredients] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: "",
    image: null,
  });
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListEmpty, setIsListEmpty] = useState(true);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchIngredients();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            paddingRight: 16,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("ScanScreen")}>
            <Feather name="camera" size={24} color="#2A4859" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal()}>
            <Feather name="plus" size={24} color="#2A4859" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            paddingLeft: 16,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("ShoppingList")}>
            <MaterialCommunityIcons
              name="cart-plus"
              size={24}
              color="#2A4859"
            />
          </TouchableOpacity>
        </View>
      ),
    });
    fetchIngredients();
  }, [navigation]);

  const fetchIngredients = async () => {
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
        setIsListEmpty(response.data.items.length === 0);
      } else {
        // console.log('Unexpected format in response: ', response);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des ingrédients du garde-manger",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredientDetails = async (ingredientName) => {
    try {
      const response = await axiosInstance.get(`/api/v1/ingredient/search`, {
        params: { query: ingredientName },
      });

      const matchingIngredient = response.data.data.find(
        (ingredient) => ingredient.name === ingredientName
      );

      if (!matchingIngredient) {
        console.error(
          `Aucun ingrédient correspondant ne peut être trouvé pour ${ingredientName}`
        );
        return {};
      } else {
        return matchingIngredient;
      }
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des détails de l'ingrédient ${ingredientName}`
      );
    }
  };

  const fetchIngredientOptions = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/ingredient/search", {
        params: { query },
      });
      setIngredientOptions(response.data.data.slice(0, 10) || []);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des options d'ingrédients",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateItem = async (isUpdating) => {
    if (currentItem.name.length < 3) {
      Alert.alert(
        "Erreur",
        "Le nom de l'ingrédient doit comporter au moins 3 caractères."
      );
      return;
    }

    const itemToSend = {
      ingredient_name: currentItem.name,
      quantity: currentItem.quantity,
      unit: currentItem.unit,
    };

    try {
      let response;

      const existingItem = pantryItems.find(
        (item) => item.ingredient_name === currentItem.name
      );

      if (!isUpdating && existingItem) {
        itemToSend.quantity += existingItem.quantity;
        response = await axiosInstance.put(
          `/api/v1/pantry/${existingItem._id}`,
          itemToSend
        );
      } else if (!isUpdating) {
        response = await axiosInstance.post("/api/v1/pantry", itemToSend);
      } else {
        response = await axiosInstance.put(
          `/api/v1/pantry/${currentItem._id}`,
          itemToSend
        );
      }

      setCurrentItem({
        id: null,
        name: "",
        quantity: 1,
        unit: "pieces",
        image: null,
      });
      setModalVisible(false);
      fetchIngredients();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Erreur lors de l'ajout ou de la mise à jour de l'ingrédient.",
      });
      console.error(
        `Erreur lors de l'${
          isUpdating ? "mise à jour" : "ajout"
        } de l'ingrédient`,
        error
      );
    }
  };

  const deleteIngredient = async (ingredient_name) => {
    try {
      const pantryItem = pantryItems.find(
        (item) => item.ingredient_name === ingredient_name
      );
      if (!pantryItem) {
        console.error("Pantry item not found");
        return;
      }

      await axiosInstance.delete(`/api/v1/pantry`, {
        params: { ingredient_name: ingredient_name },
      });
      fetchIngredients();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (
    item = { id: null, name: "", quantity: 1, unit: "pieces" }
  ) => {
    setCurrentItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchIngredientOptions(query);
  };

  const handleIngredientSelect = (ingredient) => {
    setCurrentItem({
      ...currentItem,
      name: ingredient.name,
      image: ingredient.image,
    });
    setSearchQuery(ingredient.name);
    setIngredientOptions([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemImageContainer}>
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require("../../assets/images/ingredients/beef.png")
          }
          style={styles.itemImage}
        />
      </View>
      <View style={styles.detailsItemContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteIngredient(item.ingredient_name)}
        style={styles.trashButton}
      >
        <Ionicons name="trash" size={24} color="#F5F5F5" />
      </TouchableOpacity>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>
        Votre garde-manger semble vide. Ajoutez des articles en utilisant le
        bouton "+" en haut à droite.
      </Text>
      <Image
        style={{
          height: 300,
          width: 300,
          position: "absolute",
          alignSelf: "center",
          bottom: -100,
        }}
        source={require("../../assets/images/balancecook.png")}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={styles.containerImageBackground}>
        <ImageBackground
          source={require("../../assets/images/frigopen.png")}
          style={styles.imageBackground}
        />
      </View> */}
      {isListEmpty && <EmptyListComponent />}
      <SafeAreaView style={styles.safeAreaView}>
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          data={pantryItems}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
        />
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalView}
        >
          <View style={styles.modalContent}>
            <Image
              source={require("../../assets/images/easy.png")}
              style={styles.decorationImage}
            />
            <Text style={styles.modalText}>Ajouter un aliment</Text>
            <View>
              <Text style={styles.modalInputTitle}>Nom de l'aliment</Text>
              <TextInput
                style={styles.input}
                placeholder="Carotte"
                placeholderTextColor="lightgrey"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {loading && <ActivityIndicator size="small" color="#0000ff" />}
              {ingredientOptions.length > 0 && (
                <FlatList
                  data={ingredientOptions}
                  keyExtractor={(item) => item._id.toString()} // Assurez-vous que chaque item a une propriété `_id` ou changez-le en conséquence
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleIngredientSelect(item)}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close-outline" size={40} color="#FCA721" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAddOrUpdateItem(Boolean(currentItem.id))}
              >
                <Ionicons name="checkmark" size={40} color="#2CD9BE" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerImageBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  safeAreaView: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingTop: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    shadowColor: "darkgrey",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.7,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 70,
    padding: 4,
    gap: 8,
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
  detailsItemContainer: {
    gap: 4,
  },
  itemText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 14,
    paddingLeft: 10,
  },
  quantityValueText: {
    fontSize: 14,
    paddingLeft: 4,
    fontWeight: "bold",
  },
  trashButton: {
    backgroundColor: "#FCA721",
    position: "absolute",
    padding: 8,
    top: -10,
    right: -10,
    zIndex: 1,
    borderRadius: 50,
  },
  addButton: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    bottom: 23,
    right: 6,
    borderRadius: 50,
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
  modalView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
  },
  modalContent: {
    gap: 8,
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 20,
    shadowColor: "darkgrey",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.4,
  },
  decorationImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    position: "absolute",
    top: -100,
    right: -30,
    zIndex: 1,
  },
  modalInputTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 47,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    marginTop: 4,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
