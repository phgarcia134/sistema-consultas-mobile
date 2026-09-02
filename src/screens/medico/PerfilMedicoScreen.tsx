import React, { useState, useEffect } from "react";
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
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import {
  buscarMedicoPorId,
  atualizarMedico,
} from "../../services/medicoService";
import { Medico } from "../../interfaces/medico";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PerfilMedico">;
  route: RouteProp<RootStackParamList, "PerfilMedico">;
};

export default function PerfilMedicoScreen({ navigation, route }: Props) {
  const { medicoId, medicoNome } = route.params;
  const [medico, setMedico] = useState<Medico | null>(null);
  const [valorConsulta, setValorConsulta] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarMedicoPorId(medicoId)
      .then((m) => {
        setMedico(m);
        if (m.valorConsulta != null) {
          setValorConsulta(String(m.valorConsulta).replace(".", ","));
        }
      })
      .finally(() => setCarregando(false));
  }, [medicoId]);

  async function handleSalvar() {
    const valorNum = parseFloat(valorConsulta.replace(",", "."));
    if (!valorConsulta.trim() || isNaN(valorNum) || valorNum <= 0) {
      setErro("Digite um valor valido para a consulta (ex: 250,00).");
      return;
    }
    if (!medico) return;

    try {
      setSalvando(true);
      setErro("");
      await atualizarMedico(medicoId, { ...medico, valorConsulta: valorNum });
      navigation.replace("ConsultasMedico", { medicoId, medicoNome });
    } catch {
      setErro("Erro ao salvar. Verifique a conexao e tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
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
        <Text style={styles.titulo}>Complete seu Perfil</Text>

        <View style={styles.formulario}>
          <View style={styles.avisoBox}>
            <Text style={styles.avisoTexto}>
              Para acessar o sistema, voce precisa cadastrar o valor da sua
              consulta. O cadastro fica inativo ate que todos os dados
              obrigatorios sejam preenchidos.
            </Text>
          </View>

          <View style={styles.infoMedico}>
            <Text style={styles.infoLabel}>Medico(a)</Text>
            <Text style={styles.infoNome}>{medicoNome}</Text>
            {medico?.especialidade && (
              <Text style={styles.infoEsp}>{medico.especialidade.nome}</Text>
            )}
          </View>

          <Text style={styles.label}>Valor da Consulta (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 250,00"
            placeholderTextColor="#aaa"
            keyboardType="decimal-pad"
            value={valorConsulta}
            onChangeText={(t) => {
              setValorConsulta(t);
              setErro("");
            }}
          />
          <Text style={styles.hint}>
            Este valor sera exibido para os pacientes ao agendar com voce.
          </Text>

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, salvando && styles.botaoDesabilitado]}
            onPress={handleSalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Salvar e Continuar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#79059C" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#79059C",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { flexGrow: 1, padding: 24, paddingTop: 20, paddingBottom: 40 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  formulario: { backgroundColor: "#fff", borderRadius: 16, padding: 24 },
  avisoBox: {
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  avisoTexto: { fontSize: 13, color: "#856404", lineHeight: 18 },
  infoMedico: {
    backgroundColor: "#f0e6f5",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  infoLabel: { fontSize: 12, color: "#79059C", fontWeight: "600" },
  infoNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a0070",
    marginTop: 2,
  },
  infoEsp: { fontSize: 13, color: "#666", marginTop: 2 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 4,
    color: "#333",
  },
  hint: { fontSize: 12, color: "#999", marginBottom: 16 },
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
    marginTop: 4,
  },
  botaoDesabilitado: { backgroundColor: "#b57bc0" },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
