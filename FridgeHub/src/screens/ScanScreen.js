import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Button,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { recognizeIngredientsInImage } from "../services/ClarifaiService";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [ingredients, setIngredients] = useState({});
  const cameraRef = useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const captureHighQualityPhoto = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync({ quality: 1.0 });
      return photo.uri;
    }
  };

  const resize = async (photo) => {
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { height: 300, width: 300 } }],
      { base64: true }
    );
    return manipulatedImage.base64;
  };

  const startRecognizing = async () => {
    if (cameraRef.current && permission && permission.granted) {
      try {
        const photo = await captureHighQualityPhoto();
        const resized = await resize(photo);
        const detectedIngredients = await recognizeIngredientsInImage(resized);
        setIngredients((prevIngredients) => {
          const updatedIngredients = { ...prevIngredients };
          detectedIngredients.forEach((ingredient) => {
            if (updatedIngredients[ingredient]) {
              updatedIngredients[ingredient] += 1;
            } else {
              updatedIngredients[ingredient] = 1;
            }
          });
          return updatedIngredients;
        });
      } catch (error) {
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la reconnaissance des ingrédients."
        );
        console.error(error);
      }
    }
  };

  const saveIngredients = async () => {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const promises = Object.keys(ingredients).map((key) =>
        axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/api/v1/pantry`,
          {
            ingredient_name: key,
            quantity: 1,
            unit: "pieces",
          },
          config
        )
      );
      await Promise.all(promises);
      Alert.alert("Succès", "Ingrédients ajoutés au garde-manger avec succès.");
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'envoi des ingrédients."
      );
      console.error(error);
    }
  };

  const updateIngredientName = (key, newName) => {
    setIngredients((prevIngredients) => {
      const updatedIngredients = { ...prevIngredients };
      if (updatedIngredients[key]) {
        updatedIngredients[newName] = updatedIngredients[key];
        delete updatedIngredients[key];
      }
      return updatedIngredients;
    });
  };

  const removeIngredient = (key) => {
    setIngredients((prevIngredients) => {
      const updatedIngredients = { ...prevIngredients };
      delete updatedIngredients[key];
      return updatedIngredients;
    });
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Nous avons besoin de votre permission pour utiliser la caméra
        </Text>
        <Button onPress={requestPermission} title="Accorder la permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} />
          <View style={styles.overlay}>
            <FlatList
              data={Object.keys(ingredients).map((key) => ({
                key,
              }))}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <View style={styles.ingredientContainer}>
                  <TextInput
                    style={styles.ingredientName}
                    value={item.key}
                    onChangeText={(text) =>
                      updateIngredientName(item.key, text)
                    }
                  />
                  <TouchableOpacity
                    onPress={() => removeIngredient(item.key)}
                    style={styles.trashButton}
                  >
                    <Ionicons name={"trash"} size={24} color="#F5F5F5" />
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={[
                styles.ingredientList,
                isKeyboardVisible
                  ? styles.ingredientListKeyboardVisible
                  : styles.ingredientListKeyboardHidden,
              ]}
            />
            <TouchableOpacity
              style={styles.captureButton}
              onPress={startRecognizing}
            >
              <View style={styles.innerCircle} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={saveIngredients}
            >
              <AntDesign
                style={styles.addButtonText}
                name={"pluscircle"}
                size={40}
                color="#2CD9BE"
              />
            </TouchableOpacity>
          </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    height: "100%",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  ingredientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  ingredientName: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginRight: 10,
    backgroundColor: "#f9f9f9",
  },
  ingredientQuantity: {
    width: 60,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    marginRight: 10,
  },
  trashButton: {
    backgroundColor: "#ff6347",
    borderRadius: 5,
    padding: 5,
  },
  permissionText: {
    textAlign: "center",
    color: "white",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    left: "65%",
    backgroundColor: "#ff6347",
    borderRadius: 50,
    padding: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  captureButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -35,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff6347",
  },
  ingredientList: {
    maxHeight: 200,
    paddingBottom: 20, 
  },
  ingredientListKeyboardVisible: {
    marginBottom: 300, 
  },
  ingredientListKeyboardHidden: {
    marginBottom: 100, 
  },
});