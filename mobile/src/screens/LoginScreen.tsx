import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import type { StackScreenProps } from "../types/navigation";
import InputText from "../components/InputText";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginScreen({ navigation }: StackScreenProps<"Login">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    try {
      await login(email, password);
      navigation.replace("Main");
    } catch (e: any) {
      setError("E-mail ou senha inválidos.");
    }
  };

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
          <Text style={styles.title}>Entrar</Text>
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
          <PrimaryButton onPress={handleLogin}>Entrar</PrimaryButton>
          <TouchableOpacity onPress={() => navigation.replace("Cadastro")}>
            <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
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
  passwordContainer: {
    width: "100%",
    marginBottom: 14,
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    bottom: 6,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
