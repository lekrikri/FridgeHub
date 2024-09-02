import React, { useEffect, useState, useContext } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import axiosInstance from "../../../axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const RecipeImage = ({ recipeId }) => {
  const { token } = useContext(AuthContext);
  const [recipeDetail, setRecipeDetail] = useState(null);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/recipe/${recipeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipeDetail(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipeDetail();
  }, [recipeId, token]);

  if (!recipeDetail) return null;

  return (
    <>
      <View style={styles.recipeImageContainer}>
        <Image
          source={{ uri: recipeDetail.image }}
          style={styles.recipeImage}
        />
      </View>
      <Text style={styles.recipeName}>{recipeDetail.title}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  recipeImageContainer: {
    height: 300,
    width: 300,
    top: -140,
    position: "absolute",
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    alignSelf: "center",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  recipeName: {
    marginTop: 150,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2A4859",
  },
});

export default RecipeImage;
