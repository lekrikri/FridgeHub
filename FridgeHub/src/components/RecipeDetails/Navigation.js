import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { color } from "react-native-elements/dist/helpers";

const Navigation = ({ navigation, color }) => {
  const { token } = useContext(AuthContext);

  return (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome
          name={"arrow-circle-left"}
          style={styles.navigationButtonIcon}
          color={color}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 16,
  },
  navigationButton: {
    justifyContent: "center",
    minHeight: 42,
  },
  navigationButtonIcon: {
    fontSize: 30,
    marginTop: 30,
  },
  favoriteIcon: {
    color: "blue",
  },
});

export default Navigation;
