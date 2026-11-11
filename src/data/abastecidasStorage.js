import { supabase } from "../services/supabase";

// Busca todas as abastecidas no banco, da mais nova para a mais antiga
export async function listarAbastecidas() {
  const { data, error } = await supabase
    .from('abastecidas')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Insere UMA abastecida nova no banco (o id é gerado pelo próprio banco)
export async function adicionarAbastecida(abastecida) {
  const { data, error } = await supabase
    .from('abastecidas')
    .insert(abastecida)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Apaga a abastecida com o id informado
export async function removerAbastecida(id) {
  const { error } = await supabase
    .from('abastecidas')
    .delete()
    .eq('id', id);

  if (error) throw error;
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
