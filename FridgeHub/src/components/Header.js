import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Header = ({ headerText }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        {"Salut " + headerText}
      </Text>
      <FontAwesome name={"bell-o"} size={25} color="#fba922" />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
