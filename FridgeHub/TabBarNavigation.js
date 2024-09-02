import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import RecipeListScreen from "./src/screens/RecipeListScreen";
import FavoriteScreen from "./src/screens/FavoriteScreen";
import RecipeMakerScreen from "./src/screens/RecipeMakerScreen";
import ScanScreen from "./src/screens/ScanScreen";
import PantryScreen from "./src/screens/PantryScreen";
import RecipeDetailsScreen from "./src/screens/RecipeDetailsScreen";
import RecipeStepScreen from "./src/screens/RecipeStepScreen";
import { Ionicons } from "@expo/vector-icons";
import TogglePantry from "./src/screens/TogglePantry";
import ShoppingListScreen from "./src/screens/ShoppingListScreen";
import ProfileScreenV2 from "./src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileTab = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile Page"
      component={ProfileScreenV2}
      options={{ title: "Profile", headerTintColor: "#2A4859" }}
    />
  </Stack.Navigator>
);

const FavoriteTab = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Favorite Page"
      component={FavoriteScreen}
      options={{ title: "Favoris", headerTintColor: "#2A4859" }}
    />
  </Stack.Navigator>
);

const RecipeListTab = () => (
  <Stack.Navigator initialRouteName="RecipeList">
    <Stack.Screen
      name="RecipeList"
      component={RecipeListScreen}
      options={{ headerShown: false, title: "RecipeList" }}
    />
    <Stack.Screen
      name="RecipeDetail"
      component={RecipeDetailsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RecipeStep"
      component={RecipeStepScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const PantryTab = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "black",
    }}
  >
    <Stack.Screen
      name="Pantry Page"
      component={PantryScreen}
      options={{ title: "Garde-manger", headerTintColor: "#2A4859" }}
    />
    <Stack.Screen
      name="ShoppingList"
      component={ShoppingListScreen}
      options={{
        title: "Liste de courses",
        headerBackTitleVisible: false,
        headerTintColor: "#2A4859",
      }}
    />
    <Stack.Screen
      name="ScanScreen"
      component={ScanScreen}
      options={{
        title: "Caméra",
        headerBackTitleVisible: false,
        headerTintColor: "#2A4859",
      }}
    />
  </Stack.Navigator>
);

const RecipeMakerTab = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Recipe Maker Page"
      component={RecipeMakerScreen}
      options={{ title: "Créateur de recettes", headerTintColor: "#2A4859" }}
    />
  </Stack.Navigator>
);

const TabBarNavigation = () => (
  <Tab.Navigator
    initialRouteName="Recette"
    screenOptions={{
      tabBarInactiveTintColor: "#FCA721",
      tabBarActiveTintColor: "#2CD9BE",
      headerShown: false,
      tabBarStyle: { backgroundColor: "#F5F5F5" },
    }}
  >
    <Tab.Screen
      name="Profil"
      component={ProfileTab}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="man" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Favoris"
      component={FavoriteTab}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="heart" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Recette"
      component={RecipeListTab}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="restaurant" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Garde-manger"
      component={PantryTab}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="fast-food" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Création"
      component={RecipeMakerTab}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="create" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default TabBarNavigation;
