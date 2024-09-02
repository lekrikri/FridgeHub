import React, { useContext, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import figo from "../../assets/images/figo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../axiosInstance";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !username) {
      alert("Email, password, and username are required.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/api/v1/auth/register", {
        username,
        email,
        password,
      }).then(() => { 
        navigation.navigate("LoginScreen");
      })
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert("Invalid request. Check your input and try again.");
            break;
          case 409:
            alert("Email already in use. Please try another one.");
            break;
          default:
            alert("An unexpected error occurred. Please try again.");
            break;
        }
      } else if (error.message === "Network Error") {
        alert("Cannot reach the server. Please check your connection.");
      } else {
        console.error(error);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#F5F5F5", "#2CD9BE", "#FCA721"]}
      locations={[0.2, 0.7, 1]}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Fridge</Text>
          <Text style={styles.hubText}>HUB</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image source={figo} style={styles.imageFigo} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.loginTitleText}>Nom d'utilisateur</Text>
          <TextInput
            placeholder="Votre nom d'utilisateur"
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.loginTitleText}>Email</Text>
          <TextInput
            placeholder="monfigo@vide.fr"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.loginTitleText}>Mot de passe</Text>
          <TextInput
            placeholder="••••••••••"
            secureTextEntry={true}
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.registerButton} onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.registerText}>S'inscrire</Text>
            )}
          </Pressable>
          <Pressable
            style={styles.loginButton}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text style={[styles.newInFridgeText, { textAlign: "center" }]}>
              Déjà inscrit ?
            </Text>
            <Text style={[styles.loginButtonText, { textAlign: "center" }]}>
              Se connecter
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    paddingTop: height * 0.05,
    padding: 16,
  },
  titleText: {
    fontSize: width * 0.16,
    fontWeight: "500",
    fontFamily: "LuckiestGuy",
    color: "#2CD9BE",
  },
  hubText: {
    fontSize: width * 0.16,
    color: "#FCA721",
    fontWeight: "500",
    fontFamily: "LuckiestGuy",
    marginTop: -height * 0.02,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: -35,
  },
  imageFigo: {
    width: width * 1.1,
    height: height * 0.5,
    resizeMode: "contain",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
    padding: 30,
    marginTop: -65,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "flex-start",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  loginTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#052531",
  },
  textInput: {
    backgroundColor: "#fdfdfd",
    width: "100%",
    height: 47,
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.3 },
    shadowOpacity: 0.2,
    shadowRadius: 0.3,
    elevation: 1,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#FCA721",
    width: "100%",
    height: 47,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  registerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  newInFridgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#052531",
    marginRight: 5,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0a2f6c",
  },
});

export default RegisterScreen;
