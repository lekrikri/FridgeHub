import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import chronocook from "../../../assets/images/choronocook.png";
import easy from "../../../assets/images/easy.png";
import medium from "../../../assets/images/medium.png";
import hard from "../../../assets/images/hard.png";
import balancecook from "../../../assets/images/balancecook.png";

const Extra = ({ recipe }) => {
  return (
    <View style={styles.extraDetailsContainer}>
      <View>
        <View style={styles.extraCell}>
          <Image source={chronocook} style={styles.extraCellImage} />
          <Text style={styles.extraCellText}>{recipe.totalTime} min</Text>
        </View>
      </View>

      <View>
        <View style={styles.extraCell}>
          <Image
            source={
              recipe.difficulty === "Facile"
                ? easy
                : recipe.difficulty === "Moyen"
                ? medium
                : recipe.difficulty === "Hard"
                ? hard
                : undefined
            }
            style={styles.extraCellImage}
          />
          <Text style={styles.extraCellText}>{recipe.difficulty}</Text>
        </View>
      </View>

      <View>
        <View style={styles.extraCell}>
          <Image
            source={balancecook}
            style={{
              width: 90,
              height: 100,
              resizeMode: "contain",
            }}
          />
          <Text style={styles.extraCellText}>{recipe.kcal} kcal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  extraDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 96,
    paddingHorizontal: 16,
  },
  extraCell: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    height: 150,
  },
  extraCellImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  extraCellText: {
    fontSize: 17,
    fontWeight: "bold", // Changed from 500, as react native expects 'bold' instead of 500
    color: "rgba(18,54,65,1)",
  },
});

export default Extra;
