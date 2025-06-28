import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RecipesScreen from "../screens/RecipesScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import CreateRecipeScreen from "../screens/CreateRecipeScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import TabNavigator from "./TabNavigator";
import type { RootStackParamList } from "../types/navigation";
import EditRecipeScreen from "../screens/EditRecipeScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="Receitas" component={RecipesScreen} />
        <Stack.Screen name="Favoritos" component={FavoritesScreen} />
        <Stack.Screen name="Criar Receita" component={CreateRecipeScreen} />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetalheReceita"
          component={RecipeDetailScreen}
          options={{
            headerShown: true,
            title: "Detalhes da Receita",
            headerTitleStyle: { color: "#2563eb", fontWeight: "bold" },
            headerBackTitle: "Voltar",
            headerBackVisible: true,
          }}
        />
        <Stack.Screen name="EditarPerfil" component={EditProfileScreen} />
        <Stack.Screen
          name="EditarReceita"
          component={EditRecipeScreen}
          options={{
            headerShown: true,
            title: "Editar Receita",
            headerTitleStyle: { color: "#2563eb", fontWeight: "bold" },
            headerBackTitle: "Voltar",
            headerBackVisible: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
