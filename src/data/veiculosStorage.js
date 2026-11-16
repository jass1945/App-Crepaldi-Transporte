import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

const CHAVE_VEICULOS = '@crepaldi:veiculos';

function comTimeout(promessa, ms = 5000) {
  return Promise.race([
    promessa,
    new Promise((_, rejeitar) =>
      setTimeout(() => rejeitar(new Error('Tempo esgotado')), ms)
    ),
  ]);
}

export async function listarVeiculosLocais() {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_VEICULOS);
    return dados ? JSON.parse(dados) : [];
  } catch {
    return [];
  }
}

export async function atualizarVeiculos() {
  const { data, error } = await comTimeout(
    supabase
      .from('veiculos')
      .select('id, placa, modelo')
      .eq('ativo', true)
      .order('placa', { ascending: true })
  );

  if (error) throw error;

  const lista = data ?? [];

  if (lista.length > 0) {
    await AsyncStorage.setItem(CHAVE_VEICULOS, JSON.stringify(lista));
  }

  return lista;
}

export async function listarVeiculos() {
  try {
    const lista = await atualizarVeiculos();
    if (lista.length > 0) return lista;
  } catch {
  }
  return listarVeiculosLocais();
}