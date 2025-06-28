import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RecipesScreen from "../screens/RecipesScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import CreateRecipeScreen from "../screens/CreateRecipeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = "home";
          if (route.name === "Receitas") iconName = "book-open";
          if (route.name === "Favoritos") iconName = "heart";
          if (route.name === "Criar Receita") iconName = "plus-circle";
          if (route.name === "Perfil") iconName = "user";
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#888",
      })}
    >
      <Tab.Screen
        name="Receitas"
        component={RecipesScreen}
        options={{
          title: "Receitas",
          headerTitleStyle: { color: "#2563eb", fontWeight: "bold" },
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{
          title: "Favoritos",
          headerTitleStyle: { color: "#2563eb", fontWeight: "bold" },
        }}
      />
      <Tab.Screen
        name="Criar Receita"
        component={CreateRecipeScreen}
        options={{
          title: "Criar Receita",
          headerTitleStyle: { color: "#2563eb", fontWeight: "bold" },
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          headerTitleStyle: { color: "#2563eb", fontWeight: "bold" },
        }}
      />
    </Tab.Navigator>
  );
}
