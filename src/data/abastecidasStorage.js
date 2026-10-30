
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ABASTECIDAS = '@crepaldi:abastecidas';

export async function listarAbastecidas() {
  const dados = await AsyncStorage.getItem(CHAVE_ABASTECIDAS);
  return dados ? JSON.parse(dados) : [];
}

export async function adicionarAbastecida(abastecida) {
  const abastecidas = await listarAbastecidas();

  const novasAbastecidas = [
    { ...abastecida, id: String(Date.now()) },
    ...abastecidas,
  ];

  await AsyncStorage.setItem(
    CHAVE_ABASTECIDAS,
    JSON.stringify(novasAbastecidas)
  );

  return novasAbastecidas;
}

export async function removerAbastecida(id) {
  const abastecidas = await listarAbastecidas();
  const novasAbastecidas = abastecidas.filter((item) => item.id !== id);

  await AsyncStorage.setItem(
    CHAVE_ABASTECIDAS,
    JSON.stringify(novasAbastecidas)
  );

  return novasAbastecidas;
}

// Aceita "1.234,56", "1234,56" ou "1234.56"
export function paraNumero(texto) {
  if (texto === undefined || texto === null) return 0;
  let limpo = String(texto).trim();
  if (limpo.includes(',')) {
    limpo = limpo.replace(/\./g, '').replace(',', '.');
  }
  const numero = parseFloat(limpo);
  return isNaN(numero) ? 0 : numero;
}

export function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatarNumero(valor, casas = 2) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

export async function buscarUltimaAbastecida(placa) {
const lista = await listarAbastecidas();
const doVeiculo = lista.filter(
  (a) => a.placa === placa && a.combustivel !== 'Arla 32'
  );
if (doVeiculo.length === 0) return null;
  return doVeiculo.reduce((maior, a) => (a.hodometro > maior.hodometro ? a : maior));
}