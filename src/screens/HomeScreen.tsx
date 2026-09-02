import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#79059C" />
      <View style={styles.content}>
        <Text style={styles.titulo}>Sistema de Consultas</Text>
        <Text style={styles.subtitulo}>Como deseja acessar?</Text>

        {/* Botao Paciente */}
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate("LoginPaciente")}
          activeOpacity={0.85}
        >
          <Text style={styles.botaoTitulo}>Sou Paciente</Text>
          <Text style={styles.botaoDescricao}>
            Agende consultas e acompanhe seus atendimentos
          </Text>
        </TouchableOpacity>

        {/* Botao Medico */}
        <TouchableOpacity
          style={[styles.botao, styles.botaoMedico]}
          onPress={() => navigation.navigate("LoginMedico")}
          activeOpacity={0.85}
        >
          <Text style={[styles.botaoTitulo, styles.botaoMedicoTitulo]}>
            Sou Medico
          </Text>
          <Text style={[styles.botaoDescricao, styles.botaoMedicoDescricao]}>
            Gerencie suas consultas agendadas
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 52,
  },
  botao: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  botaoMedico: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#79059C",
    marginBottom: 4,
  },
  botaoDescricao: {
    fontSize: 13,
    color: "#999",
  },
  botaoMedicoTitulo: {
    color: "#fff",
  },
  botaoMedicoDescricao: {
    color: "rgba(255,255,255,0.75)",
  },
});
