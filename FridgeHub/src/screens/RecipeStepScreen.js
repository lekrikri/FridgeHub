import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { LogBox } from 'react-native';

const RecipeStepScreen = ({ navigation, route }) => {
  const { step, stepIndex, totalSteps, goToNextStep, goToPreviousStep } =
    route.params;
  const handleGoBack = () => {
    Speech.stop();
    navigation.goBack();
  };

  useEffect(() => {
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);
    const instructionsText = step.instructions.join(" ");
    Speech.speak(instructionsText);

    return () => {
      Speech.stop();
    };
  }, [step.instructions]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        {step.instructions.map((instruction, index) => (
          <Text key={index} style={styles.instructionText}>
            {instruction}
          </Text>
        ))}
      </View>
      <View style={styles.navigationButtons}>
        {stepIndex > 0 && (
          <TouchableOpacity
            style={styles.prevButton}
            onPress={goToPreviousStep}
          >
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        )}
        {stepIndex < totalSteps - 1 && (
          <TouchableOpacity style={styles.nextButton} onPress={goToNextStep}>
            <Ionicons name="arrow-forward" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  prevButton: {
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 50,
  },
  nextButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 50,
  },
});

export default RecipeStepScreen;
