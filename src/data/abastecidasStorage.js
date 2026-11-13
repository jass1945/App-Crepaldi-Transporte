
import { supabase } from "../services/supabase";

// Converte a data de DD/MM/AAAA para AAAA-MM-DD
function converterDataParaBanco(data) {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

// Converte a data de AAAA-MM-DD para DD/MM/AAAA
function converterDataParaTela(data) {
  if (!data) return data;
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Busca todas as abastecidas no banco, da mais nova para a mais antiga
export async function listarAbastecidas() {
  const { data, error } = await supabase
    .from('abastecida')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => ({
    ...item,
    placa: item.placa_do_veiculo,
    data: converterDataParaTela(item.data),
    total: item.valor_pago,
    litros: item.litros_abastecidos,
    precoLitro:
      item.litros_abastecidos > 0
        ? item.valor_pago / item.litros_abastecidos
        : 0,
  }));
}

// Insere UMA abastecida nova no banco (o id é gerado pelo próprio banco)
export async function adicionarAbastecida(abastecida) {
  const { error } = await supabase
    .from('abastecida')
    .insert({
      placa_do_veiculo: abastecida.placa,
      data: converterDataParaBanco(abastecida.data),
      hodometro: abastecida.hodometro,
      combustivel: abastecida.combustivel,
      valor_pago: abastecida.total,
      litros_abastecidos: abastecida.litros,
      posto: abastecida.posto,
    });

  if (error) throw error;
  }

// Apaga a abastecida com o id informado
export async function removerAbastecida(id) {
  const { error } = await supabase
    .from('abastecida')
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
