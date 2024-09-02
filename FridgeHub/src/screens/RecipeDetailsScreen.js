import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import axiosInstance from "../../axiosInstance";
import { AuthContext } from "../context/AuthContext";
import Description from "../components/RecipeDetails/Description";
import RecipeImage from "../components/RecipeDetails/RecipeImage";
import Navigation from "../components/RecipeDetails/Navigation";
import Extra from "../components/RecipeDetails/Extra";
import Ingredient from "../components/RecipeDetails/Ingredient";
import Ustensil from "../components/RecipeDetails/Ustensil";

const RecipeDetailsScreen = ({ navigation, route }) => {
  const recipe = route?.params?.item;
  const { token, userId } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const isFav = response.data.data.some(
          (fav) => fav.userId === userId && fav.recipeId === recipe._id
        );
        setIsFavorite(isFav);
      } catch (err) {
        console.error("Failed to check if favorite: ", err);
        setError("Failed to check favorite.");
      } finally {
        setLoading(false);
      }
    };
    checkIfFavorite();
  }, [recipe, token, userId]);

  const startRecipe = () => {
    navigation.navigate("RecipeStep", {
      step: recipe.step[0],
      stepIndex: 0,
      totalSteps: recipe.step.length,
      goToNextStep: () => handleNextStep(0),
      goToPreviousStep: () => handlePreviousStep(0),
    });
  };

  const handleNextStep = (currentStepIndex) => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < recipe.step.length) {
      navigation.navigate("RecipeStep", {
        step: recipe.step[nextStepIndex],
        stepIndex: nextStepIndex,
        totalSteps: recipe.step.length,
        goToNextStep: () => handleNextStep(nextStepIndex),
        goToPreviousStep: () => handlePreviousStep(nextStepIndex),
      });
    }
  };

  const handlePreviousStep = (currentStepIndex) => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      navigation.navigate("RecipeStep", {
        step: recipe.step[prevStepIndex],
        stepIndex: prevStepIndex,
        totalSteps: recipe.step.length,
        goToNextStep: () => handleNextStep(prevStepIndex),
        goToPreviousStep: () => handlePreviousStep(prevStepIndex),
      });
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/api/v1/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId: userId, recipeId: recipe._id },
        });

        setIsFavorite(false);
        console.log("Removed from favorites");
      } else {
        await axiosInstance.post(
          `/api/v1/favorite`,
          {
            userId: userId,
            recipeId: recipe._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsFavorite(true);
        console.log("Added to favorites");
      }
    } catch (err) {
      console.error("Failed to toggle favorite: ", err);
      setError("Failed to add or remove from favorites.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="orange" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 200 ? "#F5F5F5" : "#F5F5F5";
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: getRandomColor() }}>
          <Navigation
            navigation={navigation}
            color={getContrastColor(getRandomColor())}
          />
          <View style={styles.roundedContainer}>
            <RecipeImage recipeId={recipe._id} />
            <Description recipe={recipe} />
            <Extra recipe={recipe} />
            <Text style={styles.sectionTitle}>Ingrédients</Text>
            <Ingredient ingredients={recipe.ingredients} />
            {recipe.ustensils?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Ustensils</Text>
                <View>
                  <Image
                    style={{
                      height: 150,
                      width: 150,
                      position: "absolute",
                      top: -90,
                      left: -60,

                      transform: [{ rotate: "30deg" }, { scaleX: -1 }],
                    }}
                    source={require("../../assets/images/figo_preparation.png")}
                  />
                  <FlatList
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    data={recipe.ustensils}
                    keyExtractor={(index) => index.toString()}
                    renderItem={({ item: ustensil }) => (
                      <Ustensil ustensilId={ustensil} />
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <View style={{ width: 16 }} />
                    )}
                  />
                </View>
              </>
            )}
            {recipe.step?.length > 0 && (
              <View style={styles.stepsContainer}>
                <Text style={styles.sectionTitle}>Étapes</Text>
                {recipe.step.map((step, index) => (
                  <View key={index} style={styles.stepView}>
                    {index === 0 && (
                      <Image
                        style={{
                          height: 150,
                          width: 150,
                          position: "absolute",
                          top: -75,
                          right: -70,
                          transform: [{ rotate: "-35deg" }],
                        }}
                        source={require("../../assets/images/figo_te_parle2.png")}
                      />
                    )}
                    {index === 2 && (
                      <Image
                        style={{
                          height: 100,
                          width: 100,
                          position: "absolute",
                          top: -55,
                          right: -55,
                          transform: [{ rotate: "-90deg" }],
                        }}
                        source={require("../../assets/images/kakarot.png")}
                      />
                    )}
                    <Text style={styles.stepIndex}>
                      {index + 1}. {step.title}
                    </Text>
                    {step.instructions.map((instruction, index) => (
                      <Text key={index} style={styles.stepText}>
                        {instruction}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.pressable} onPress={startRecipe}>
              <Text style={styles.nextStep}>Commencer la recette</Text>
              <Image
                style={{
                  height: 200,
                  width: 200,
                  position: "absolute",
                  top: -75,
                  left: -60,
                  transform: [{ rotate: "-35deg" }],
                }}
                source={require("../../assets/images/easy.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 16,
    textAlign: "center",
    color: "#2A4859",
  },
  stepsContainer: {
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  stepView: {
    flexDirection: "column",
    marginBottom: 16,
  },
  stepIndex: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    padding: 12,
    marginBottom: 10,
  },
  pressable: {
    width: "100%",
    padding: 16,
  },
  nextStep: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "orange",
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
    color: "white",
  },
  roundedContainer: {
    backgroundColor: "#F5F5F5",
    marginTop: 150,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RecipeDetailsScreen;
