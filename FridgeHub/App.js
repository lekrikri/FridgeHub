import React, { useContext, forwardRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import TabBarNavigation from "./TabBarNavigation";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

const NavigationStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="LoginScreen"
  >
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
  </Stack.Navigator>
);

const ToastWrapper = forwardRef((props, ref) => <Toast ref={ref} {...props} />);

const Main = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabBarNavigation /> : <NavigationStack />}
      <ToastWrapper />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
