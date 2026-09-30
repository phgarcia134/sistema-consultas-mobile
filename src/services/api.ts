import axios, { AxiosError } from "axios";

/**
 * BASE_URL aponta para o backend Spring Boot.
 *
 * ATENÇÃO - dependendo de onde o app está rodando:
 * - Expo Web (navegador) → localhost funciona normalmente
 * - iOS Simulator → localhost funciona normalmente
 * - Android Emulator → use 10.0.2.2 no lugar de localhost
 * - Dispositivo físico → use o IP da sua máquina (ex: 192.168.1.100)
 */
const BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

/**
 * Verifica se o erro é causado por ausência de conexão com o servidor
 * (backend offline, sem internet, timeout, etc).
 *
 * Retorna true quando não há resposta HTTP - ou seja, a requisição
 * nem chegou ao servidor ou ele não respondeu dentro do timeout.
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response;
  }
  return false;
}

/**
 * Faz um GET em /health e retorna true se o backend estiver acessível.
 * Usa timeout curto (3s) para não travar a tela de carregamento.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

