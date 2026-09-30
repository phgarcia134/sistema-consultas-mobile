import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { healthCheck } from "../services/api";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

type StatusServico = "verificando" | "online" | "offline";

export default function HomeScreen({ navigation }: Props) {
  const [statusServico, setStatusServico] = useState<StatusServico>("verificando");

  useEffect(() => {
    verificarServico();
  }, []);

  async function verificarServico() {
    setStatusServico("verificando");
    const disponivel = await healthCheck();
    setStatusServico(disponivel ? "online" : "offline");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#79059C" />
      <View style={styles.content}>
        <Text style={styles.titulo}>Sistema de Consultas</Text>
        <Text style={styles.subtitulo}>Como deseja acessar?</Text>

        {/* Banner de status do serviço */}
        {statusServico === "verificando" && (
          <View style={[styles.banner, styles.bannerVerificando]}>
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.bannerTexto}>Verificando conexão com o servidor...</Text>
          </View>
        )}

        {statusServico === "offline" && (
          <View style={[styles.banner, styles.bannerOffline]}>
            <Text style={styles.bannerTexto}>
              ⚠️ Servidor indisponível. Tente novamente mais tarde.
            </Text>
            <TouchableOpacity onPress={verificarServico} style={styles.tentarNovamenteBotao}>
              <Text style={styles.tentarNovamenteTexto}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botao Paciente */}
        <TouchableOpacity
          style={[styles.botao, statusServico === "offline" && styles.botaoDesabilitado]}
          onPress={() => navigation.navigate("LoginPaciente")}
          activeOpacity={0.85}
          disabled={statusServico === "offline"}
        >
          <Text style={styles.botaoTitulo}>Sou Paciente</Text>
          <Text style={styles.botaoDescricao}>
            Agende consultas e acompanhe seus atendimentos
          </Text>
        </TouchableOpacity>

        {/* Botao Medico */}
        <TouchableOpacity
          style={[styles.botao, styles.botaoMedico, statusServico === "offline" && styles.botaoMedicoDesabilitado]}
          onPress={() => navigation.navigate("LoginMedico")}
          activeOpacity={0.85}
          disabled={statusServico === "offline"}
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
    marginBottom: 32,
  },
  banner: {
    width: "100%",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  bannerVerificando: {
    backgroundColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
  },
  bannerOffline: {
    backgroundColor: "rgba(220, 53, 69, 0.85)",
  },
  bannerTexto: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  tentarNovamenteBotao: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tentarNovamenteTexto: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
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
  botaoDesabilitado: {
    opacity: 0.4,
  },
  botaoMedico: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoMedicoDesabilitado: {
    opacity: 0.4,
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

