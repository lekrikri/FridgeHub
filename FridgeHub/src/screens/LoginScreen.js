import React, { useContext, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import figo from "../../assets/images/figo.png";
import chronocook from "../../assets/images/choronocook.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../../axiosInstance";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Email et mot de passe sont requis",
      });
      return;
    }

    setLoading(true);
    try {
      console.log(process.env.EXPO_PUBLIC_API_URL);

      const response = await axiosInstance.post("/api/v1/auth/login", {
        email,
        password,
      });
      const token = response.data.token;

      if (token) {
        await AsyncStorage.setItem("token", token);
        setIsAuthenticated(true);
        Toast.show({
          type: "success",
          text1: "Succès",
          text2: "Connexion réussie",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2:
            "Échec de l'obtention du jeton d'accès à partir de la réponse du serveur.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Email ou mot de passe incorrect.",
      });
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
      <SafeAreaView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Fridge</Text>
          <Text style={styles.hubText}>HUB</Text>
        </View>
        <View>
          <Image
            source={chronocook}
            style={[styles.imageChrono, { right: -width * 0.4 }]}
          />
        </View>
        <View style={styles.textInputContainer}>
          <View>
            <Text style={styles.loginTitleText}>Email</Text>
            <TextInput
              placeholder="monfigo@vide.fr"
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View>
            <Text style={styles.loginTitleText}>Mot de passe</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                placeholder="••••••••••"
                secureTextEntry={!passwordVisible}
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.iconVisiblePassword}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="#2A4859"
                />
              </TouchableOpacity>
            </View>
            <Pressable style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié</Text>
            </Pressable>
          </View>
          <Pressable style={styles.loginButton} onPress={handleLogin}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </Pressable>
          <Pressable
            style={styles.registerButton}
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.newInFridgeText}>Nouveau dans le frigo ?</Text>
            <Text style={styles.registerText}>Inscrivez-vous</Text>
          </Pressable>
        </View>
        <View>
          <Image
            source={figo}
            style={[styles.imageFigo, { left: -width * 0.2 }]}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flexDirection: "column",
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
    marginTop: -height * 0.02,
  },
  imageChrono: {
    width: width * 0.8,
    height: height * 0.3,
    resizeMode: "contain",
    transform: [{ rotate: "-38deg" }],
    position: "absolute",
    marginTop: -60,
  },
  textInputContainer: {
    alignItems: "left",
    gap: 8,
    marginTop: height * 0.15,
  },
  loginTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#052531",
  },
  textInput: {
    backgroundColor: "#F5F5F5",
    width: width * 0.9,
    height: 47,
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
  },
  iconVisiblePassword: {
    position: "absolute",
    right: 16,
    top: 8,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPasswordButton: {
    alignItems: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#052531",
    textDecorationLine: "underline",
    textDecorationColor: "#052531",
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: "#FCA721",
    width: width * 0.9,
    height: 47,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.9,
    gap: 4,
    marginTop: 4,
  },
  newInFridgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#052531",
    textDecorationColor: "#052531",
  },
  registerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#052531",
    textDecorationLine: "underline",
    textDecorationColor: "#052531",
  },
  imageFigo: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: "contain",
    position: "absolute",
  },
});

export default LoginScreen;
