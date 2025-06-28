import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import api from "../services/api";
import type { StackScreenProps } from "../types/navigation";
import InputText from "../components/InputText";
import PrimaryButton from "../components/PrimaryButton";

export default function RegisterScreen({
  navigation,
}: StackScreenProps<"Cadastro">) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");
    if (!email || !name || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/users", { email, name, password });
      Alert.alert("Sucesso", "Cadastro realizado! Faça login.");
      navigation.replace("Login");
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Erro ao cadastrar. Tente novamente."
      );
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
          <Text style={styles.title}>Criar Conta</Text>
          <InputText
            placeholder="Nome"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 14 }}
          />
          <InputText
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ marginBottom: 14 }}
          />
          <View style={styles.passwordContainer}>
            <InputText
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={{ paddingRight: 44 }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeIcon}
              activeOpacity={0.7}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={18}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton onPress={handleRegister} loading={loading}>
            Cadastrar
          </PrimaryButton>
          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.link}>Já tem conta? Entrar</Text>
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
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 22,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 14,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 14,
    zIndex: 1,
  },
  error: {
    color: "#ef4444",
    marginBottom: 8,
    fontSize: 14,
    textAlign: "center",
  },
  link: {
    color: "#2563eb",
    marginTop: 18,
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
