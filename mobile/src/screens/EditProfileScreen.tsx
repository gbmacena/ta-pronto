import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function EditProfileScreen({ navigation }: any) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    setLoading(true);
    try {
      const res = await api.put(`/users/${user.id}`, { name, email });
      setUser({ ...user, name, email });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erro ao atualizar perfil");
    }
    setLoading(false);
  }

  return (
    <LinearGradient
      colors={["#e0e7ff", "#fff", "#2563eb"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 22,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{ padding: 6, position: "absolute", left: 0, zIndex: 2 }}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={22} color="#2563eb" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[styles.title, { marginBottom: 0 }]}>
                Editar Perfil
              </Text>
            </View>
          </View>
          <TextInput
            style={[styles.input, { marginBottom: 14 }]}
            placeholder="Nome"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { marginBottom: 14 }]}
            placeholder="E-mail"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Salvando..." : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 22,
  },
  input: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  button: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  error: {
    color: "#ef4444",
    marginBottom: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
