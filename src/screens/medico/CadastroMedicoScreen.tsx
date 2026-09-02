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
import { RootStackParamList } from "../../navigation/types";
import { cadastrarMedico } from "../../services/medicoService";
import { listarEspecialidades } from "../../services/especialidadeService";
import { Especialidade } from "../../types/especialidade";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CadastroMedico">;
};

export default function CadastroMedicoScreen({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [valor, setValor] = useState("");
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState<Especialidade | null>(null);
  const [mostrarEspecialidades, setMostrarEspecialidades] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarEspecialidades().then(setEspecialidades);
  }, []);

  async function handleCadastrar() {
    if (!nome.trim() || !crm.trim() || !especialidadeSelecionada) {
      setErro("Preencha os campos obrigatorios: nome, CRM e especialidade.");
      return;
    }

    let valorNum: number | null = null;
    if (valor.trim()) {
      valorNum = parseFloat(valor.replace(",", "."));
      if (isNaN(valorNum) || valorNum <= 0) {
        setErro("Digite um valor valido para a consulta.");
        return;
      }
    }

    try {
      setSalvando(true);
      setErro("");
      const medico = await cadastrarMedico({
        nome: nome.trim(),
        crm: crm.trim(),
        especialidade: especialidadeSelecionada,
        ativo: true,
        valorConsulta: valorNum,
      });
      if (medico.valorConsulta == null) {
        navigation.replace("PerfilMedico", {
          medicoId: medico.id,
          medicoNome: medico.nome,
        });
      } else {
        navigation.replace("ConsultasMedico", {
          medicoId: medico.id,
          medicoNome: medico.nome,
        });
      }
    } catch {
      setErro("Erro ao cadastrar. CRM ja pode estar em uso.");
    } finally {
      setSalvando(false);
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
        <Text style={styles.titulo}>Cadastro de Medico</Text>
        <Text style={styles.subtitulo}>
          Preencha seus dados para criar sua conta
        </Text>

        <View style={styles.formulario}>
          {/* Nome */}
          <Text style={styles.label}>Nome completo * (inclua Dr. ou Dra.)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dr. Carlos Oliveira"
            value={nome}
            onChangeText={setNome}
          />

          {/* CRM */}
          <Text style={styles.label}>CRM * (somente numeros)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 123456"
            keyboardType="numeric"
            value={crm}
            onChangeText={(text) => setCrm(text.replace(/\D/g, ""))}
          />

          {/* Especialidade */}
          <Text style={styles.label}>Especialidade *</Text>
          <TouchableOpacity
            style={[
              styles.seletor,
              mostrarEspecialidades && styles.seletorAberto,
            ]}
            onPress={() => setMostrarEspecialidades(!mostrarEspecialidades)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.seletorTexto,
                !especialidadeSelecionada && styles.seletorPlaceholder,
              ]}
            >
              {especialidadeSelecionada
                ? especialidadeSelecionada.nome
                : "Selecione a especialidade"}
            </Text>
            <Text style={styles.seletorSeta}>
              {mostrarEspecialidades ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {mostrarEspecialidades && (
            <View style={styles.listaEspecialidades}>
              {especialidades.map((esp) => (
                <TouchableOpacity
                  key={String(esp.id)}
                  style={[
                    styles.itemEspecialidade,
                    especialidadeSelecionada?.id === esp.id &&
                      styles.itemSelecionado,
                  ]}
                  onPress={() => {
                    setEspecialidadeSelecionada(esp);
                    setMostrarEspecialidades(false);
                  }}
                >
                  <Text
                    style={[
                      styles.itemTexto,
                      especialidadeSelecionada?.id === esp.id &&
                        styles.itemTextoSelecionado,
                    ]}
                  >
                    {esp.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Valor */}
          <Text style={[styles.label, { marginTop: 16 }]}>
            Valor da Consulta (opcional)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 250.00"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
          />
          <Text style={styles.hint}>
            Pode ser preenchido agora ou depois no seu perfil.
          </Text>

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, salvando && styles.botaoDesabilitado]}
            onPress={handleCadastrar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Cadastrar</Text>
            )}
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
    marginBottom: 16,
    color: "#333",
  },
  hint: { fontSize: 12, color: "#999", marginBottom: 16, marginTop: -12 },
  seletor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 0,
    backgroundColor: "#fff",
  },
  seletorAberto: {
    borderColor: "#79059C",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  seletorTexto: { fontSize: 15, color: "#333" },
  seletorPlaceholder: { color: "#aaa" },
  seletorSeta: { fontSize: 12, color: "#79059C" },
  listaEspecialidades: {
    borderWidth: 1,
    borderColor: "#79059C",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  itemEspecialidade: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0e6f5",
    backgroundColor: "#fff",
  },
  itemSelecionado: { backgroundColor: "#f0e6f5" },
  itemTexto: { fontSize: 15, color: "#333" },
  itemTextoSelecionado: { color: "#79059C", fontWeight: "600" },
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
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
