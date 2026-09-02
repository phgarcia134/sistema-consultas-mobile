import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { buscarPacientePorCpf } from "../../services/pacienteService";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "LoginPaciente">;
};

export default function LoginPacienteScreen({ navigation }: Props) {
  const [cpf, setCpf] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleEntrar() {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      setErro("Digite um CPF valido com 11 digitos.");
      return;
    }
    try {
      setCarregando(true);
      setErro("");
      const paciente = await buscarPacientePorCpf(cpfLimpo);
      navigation.navigate("MinhasConsultas", {
        pacienteId: paciente.id,
        pacienteNome: paciente.nome,
      });
    } catch {
      setErro("CPF nao encontrado. Verifique ou crie um cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Bem-vindo!</Text>
        <Text style={styles.subtitulo}>
          Digite seu CPF para acessar suas consultas
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.label}>CPF (somente numeros)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 12345678900"
            keyboardType="numeric"
            maxLength={11}
            value={cpf}
            onChangeText={(text) => {
              setCpf(text.replace(/\D/g, ""));
              setErro("");
            }}
          />

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleEntrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.separador}>
            <View style={styles.linha} />
            <Text style={styles.separadorTexto}>ou</Text>
            <View style={styles.linha} />
          </View>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate("CadastroPaciente")}
          >
            <Text style={styles.botaoSecundarioTexto}>
              Nao tenho cadastro - Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#79059C" },
  content: { flexGrow: 1, justifyContent: "center", padding: 24 },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 32,
  },
  formulario: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 8,
    color: "#333",
  },
  erroTexto: {
    color: "#c0392b",
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#79059C",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  separador: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  linha: { flex: 1, height: 1, backgroundColor: "#eee" },
  separadorTexto: { marginHorizontal: 10, color: "#aaa", fontSize: 13 },
  botaoSecundario: {
    borderWidth: 1,
    borderColor: "#79059C",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  botaoSecundarioTexto: {
    color: "#79059C",
    fontWeight: "600",
    fontSize: 14,
  },
});
