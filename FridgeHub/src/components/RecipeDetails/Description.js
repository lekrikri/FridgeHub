import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import figoastuce from "../../../assets/images/figo_trucs_astuces.png";

const Description = ({ recipe }) => {
  return (
    <View style={styles.descriptionContainer}>
      <Image source={figoastuce} style={styles.descriptionImage} />
      <Text style={styles.descriptionText}>{recipe.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionContainer: {
    marginBottom: -100,
    paddingHorizontal: 16,
  },
  descriptionImage: {
    width: 100,
    height: 100,
    bottom: -26,
    alignSelf: "center",
  },
  descriptionText: {
    fontSize: 17,
    color: "rgba(18,54,65,1)",
    backgroundColor: "rgb(223,239,234)",
    borderColor: "rgba(108,214,183,1)",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    textAlign: "center",
    overflow: "hidden",
  },
});

export default Description;
