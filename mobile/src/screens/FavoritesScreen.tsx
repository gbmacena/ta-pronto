import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import { Feather } from "@expo/vector-icons";
import SearchInput from "../components/SearchInput";

export default function FavoritesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const userId = user?.id;
  const [favorites, setFavorites] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [userId])
  );

  async function fetchFavorites() {
    setLoading(true);
    try {
      const res = await api.get("/recipes", {
        params: { userId, onlyFavorites: true },
      });
      setFavorites(res.data);
      setFiltered(res.data);
    } catch (e) {
      setFavorites([]);
      setFiltered([]);
    }
    setLoading(false);
  }

  function handleSearch(text: string) {
    setSearch(text);
    if (!text) {
      setFiltered(favorites);
      return;
    }
    const lower = text.toLowerCase();
    setFiltered(
      favorites.filter(
        (r: any) =>
          r.title.toLowerCase().includes(lower) ||
          (r.category && r.category.toLowerCase().includes(lower))
      )
    );
  }

  function renderRecipe({ item }: { item: any }) {
    return (
      <RecipeCard
        recipe={item}
        onPress={() => navigation.navigate("DetalheReceita", { id: item.id })}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6", padding: 16 }}>
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
            Nenhuma receita favoritada.
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
