import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import SearchInput from "../components/SearchInput";
import { useRecipesStore } from "../store/recipesStore";
import type { Recipe } from "../store/recipesStore";

export default function RecipesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const userId = user?.id;

  const { recipes, loading, fetchRecipes } = useRecipesStore();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchRecipes(userId);
  }, [userId]);

  useEffect(() => {
    setFiltered(
      !search
        ? recipes
        : recipes.filter(
            (r) =>
              r.title.toLowerCase().includes(search.toLowerCase()) ||
              (r.category &&
                r.category.toLowerCase().includes(search.toLowerCase()))
          )
    );
  }, [search, recipes]);

  function handleSearch(text: string) {
    setSearch(text);
  }

  function renderRecipe({ item }: { item: Recipe }) {
    return (
      <RecipeCard
        recipe={item}
        onPress={() => navigation.navigate("DetalheReceita", { id: item.id })}
      />
    );
  }

  return (
    <View style={styles.container}>
      <SearchInput
        value={search}
        onChangeText={handleSearch}
        placeholder="Buscar por nome ou categoria..."
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 40 }}
        />
      ) : filtered.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Feather name="frown" size={40} color="#2563eb" />
          <Text style={{ color: "#888", marginTop: 10 }}>
            Nenhuma receita encontrada.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  recipeCategory: {
    fontSize: 13,
    color: "#2563eb",
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  recipeDesc: {
    fontSize: 15,
    color: "#444",
  },
});
