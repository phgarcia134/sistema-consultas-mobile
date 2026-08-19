import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";

// Importando a modelagem TypeScript
import { Medico } from "./src/interfaces/medico";
import { Paciente } from "./src/types/paciente";

// Importando os serviços que consomem a API real
import { listarMedicos } from "./src/services/medicoService";
import { listarPacientes } from "./src/services/pacienteService";

export default function App() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro(null);

      const [listaMedicos, listaPacientes] = await Promise.all([
        listarMedicos(),
        listarPacientes(),
      ]);

      setMedicos(listaMedicos);
      setPacientes(listaPacientes);
    } catch (error) {
      setErro(
        "Não foi possível carregar os dados.\nVerifique se o backend está rodando em http://localhost:8080"
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        contentContainerStyle={styles.scrollContent}
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            {/* Cabeçalho */}
            <View style={styles.header}>
              <Text style={styles.titulo}>Sistema de Consultas</Text>
              <Text style={styles.subtitulo}>Dados do Backend</Text>
            </View>

            {/* Indicador de carregamento */}
            {carregando && (
              <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
            )}

            {/* Mensagem de erro */}
            {erro && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTexto}>{erro}</Text>
              </View>
            )}

            {/* Lista de Médicos */}
            {!carregando && !erro && (
              <>
                <Text style={styles.secaoTitulo}>
                  👨‍⚕️ Médicos ({medicos.length})
                </Text>
                {medicos.map((medico) => (
                  <View key={medico.id} style={styles.card}>
                    <Text style={styles.cardNome}>{medico.nome}</Text>
                    <Text style={styles.cardInfo}>CRM: {medico.crm}</Text>
                    <Text style={styles.cardInfo}>
                      {medico.especialidade?.nome ?? " - "}
                    </Text>
                    <View
                      style={[
                        styles.badge,
                        medico.ativo ? styles.badgeAtivo : styles.badgeInativo,
                      ]}
                    >
                      <Text style={styles.badgeTexto}>
                        {medico.ativo ? "Ativo" : "Inativo"}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Lista de Pacientes */}
                <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>
                  👤 Pacientes ({pacientes.length})
                </Text>
                {pacientes.map((paciente) => (
                  <View key={paciente.id} style={styles.card}>
                    <Text style={styles.cardNome}>{paciente.nome}</Text>
                    <Text style={styles.cardInfo}>CPF: {paciente.cpf}</Text>
                    <Text style={styles.cardInfo}>{paciente.email}</Text>
                    {paciente.telefone && (
                      <Text style={styles.cardInfo}>Tel: {paciente.telefone}</Text>
                    )}
                  </View>
                ))}
              </>
            )}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 8,
  },
  badgeAtivo: {
    backgroundColor: "#d4edda",
  },
  badgeInativo: {
    backgroundColor: "#f8d7da",
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  erroContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255, 80, 80, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 80, 80, 0.5)",
  },
  erroTexto: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
  },
});
