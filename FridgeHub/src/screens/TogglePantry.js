import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function TogglePantry() {
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    setSelectedButton("pantry");
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === "pantry" && styles.selectedButton,
        ]}
        onPress={() => setSelectedButton("pantry")}
      >
        <Text
          style={[
            styles.buttonText,
            selectedButton === "pantry" && styles.selectedButtonText,
          ]}
        >
          Garde manger
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === "shoppingList" && styles.selectedButton,
        ]}
        onPress={() => setSelectedButton("shoppingList")}
      >
        <Text
          style={[
            styles.buttonText,
            selectedButton === "shoppingList" && styles.selectedButtonText,
          ]}
        >
          Liste de courses
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  button: {
    flex: 1,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "rgba(223,239,234,0.3)",
    borderColor: "rgba(108,214,183,1)",
    borderWidth: 2,
  },
  buttonText: {
    color: "darkgrey",
  },
  selectedButtonText: {
    color: "rgba(108,214,183,1)",
    fontWeight: "bold",
    fontSize: 16,
  },
});
