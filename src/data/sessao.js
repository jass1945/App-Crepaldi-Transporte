import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_SESSAO = '@crepaldi:sessao';

let motoristaAtual = null;

export function definirMotorista(motorista) {
  motoristaAtual = motorista;
}

export function obterMotorista() {
  return motoristaAtual;
}

export function limparMotorista() {
  motoristaAtual = null;
}

export async function salvarSessao(motorista) {
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(motorista));
}

export async function carregarSessao() {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

export async function encerrarSessao() {
  motoristaAtual = null;
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}