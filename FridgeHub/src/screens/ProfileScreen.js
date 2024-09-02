import React, { useState, useEffect, useContext } from "react";
import {
	SafeAreaView,
	Text,
	View,
	Image,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import profileImage from "../../assets/images/profile.png";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";
import EditableField from "../components/EditableField";
import axiosInstance from "../../axiosInstance";

export default function ProfileScreen() {
	const [user, setUser] = useState(null);
	const [weight, setWeight] = useState("");
	const [height, setHeight] = useState("");
	const [dietaryRestrictions, setDietaryRestrictions] = useState("");
	const [cookingSkillLevel, setCookingSkillLevel] = useState("");
	const [favoriteCuisines, setFavoriteCuisines] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const { setIsAuthenticated, token } = useContext(AuthContext);

	const fetchUserDetails = async () => {
		try {
			const response = await axiosInstance.get("/api/v1/user", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const userData = response.data.data;

			if (userData) {
				setUser(userData);
				setWeight(userData.weight?.toString() || "00");
				setHeight(userData.height?.toString() || "000");
				setDietaryRestrictions(
					userData.preferences?.dietaryRestrictions?.join(", ") || ""
				);
				setFavoriteCuisines(
					userData.preferences?.favoriteCuisines?.join(", ") || ""
				);
				setCookingSkillLevel(
					userData.preferences?.cookingSkillLevel || ""
				);
			}
		} catch (error) {
			console.error("Failed to fetch user details: ", error);
		}
	};

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem("token");
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Failed to logout: ", error);
		}
	};

	const updateUserDetails = async () => {
		try {
			await axiosInstance.patch(
				`/api/v1/user`,
				{
					weight: parseFloat(weight),
					height: parseFloat(height),
					preferences: {
						dietaryRestrictions: dietaryRestrictions
							.split(",")
							.map((item) => item.trim()),
						favoriteCuisines: favoriteCuisines
							.split(",")
							.map((item) => item.trim()),
						cookingSkillLevel,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to update profile: ", error);
		}
	};

	const toggleEditing = () => {
		setIsEditing(!isEditing);
	};

	useEffect(() => {
		fetchUserDetails();
	}, []);

	return (
		<SafeAreaView flex={1} paddingHorizontal={16}>
			<View
				style={{
					backgroundColor: "#FCA721",
					marginTop: 16,
					borderRadius: 10,
					padding: 8,
					flexDirection: "row",
				}}
			>
				<Image
					source={profileImage}
					style={{
						width: 100,
						height: 100,
						backgroundColor: "#F5F5F5",
						borderRadius: 10,
					}}
				/>
				<View
					style={{
						flexDirection: "column",
						gap: 4,
						paddingHorizontal: 8,
					}}
				>
					<Text
						style={{
							color: "#F5F5F5",
							fontSize: 20,
							fontWeight: "700",
						}}
					>
						{user?.username || "Nom d'utilisateur"}
					</Text>
					<Text
						style={{
							color: "#F5F5F5",
							fontSize: 16,
							fontWeight: "400",
						}}
					>
						{"Email : " + user?.email}
					</Text>
				</View>
				<TouchableOpacity
					style={{ position: "absolute", bottom: 8, right: 8 }}
					onPress={toggleEditing}
				>
					<Entypo name="pencil" size={24} color="#2A4859" />
				</TouchableOpacity>
			</View>
			<FlatList
				marginTop={16}
				data={[
					{
						key: "Poids",
						value: weight,
						onChange: setWeight,
						unit: "kg",
					},
					{
						key: "Taille",
						value: height,
						onChange: setHeight,
						unit: "cm",
					},
					{
						key: "Restrictions alimentaires",
						value: dietaryRestrictions,
						onChange: setDietaryRestrictions,
						unit: isEditing ? " " : "",
					},
					{
						key: "Cuisines préférées",
						value: favoriteCuisines,
						onChange: setFavoriteCuisines,
						unit: isEditing ? " " : "",
					},
					{
						key: "Niveau de cuisine",
						value: cookingSkillLevel,
						onChange: setCookingSkillLevel,
						unit: isEditing ? " " : "",
					},
				]}
				keyExtractor={(item) => item.key}
				renderItem={({ item }) => (
					<EditableField
						label={item.key}
						value={item.value}
						onChange={item.onChange}
						isEditing={isEditing}
						unit={item.unit}
					/>
				)}
				scrollEnabled={false}
				ItemSeparatorComponent={() => (
					<View
						style={{
							height: 1,
							backgroundColor: "#ccc",
							marginVertical: 16,
						}}
					/>
				)}
			/>
			{isEditing && (
				<TouchableOpacity
					style={styles.saveButton}
					onPress={updateUserDetails}
				>
					<Text style={styles.saveText}>Sauvegarder</Text>
				</TouchableOpacity>
			)}
			<TouchableOpacity
				style={styles.logoutButton}
				onPress={handleLogout}
			>
				<Text style={styles.logoutText}>Déconnexion</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	logoutButton: {
		backgroundColor: "orange",
		marginBottom: 16,
		height: 47,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	logoutText: {
		alignSelf: "center",
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
		padding: 8,
	},
	saveButton: {
		backgroundColor: "#2CD9BE",
		marginBottom: 16,
		height: 47,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	saveText: {
		alignSelf: "center",
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
		padding: 8,
	},
});
