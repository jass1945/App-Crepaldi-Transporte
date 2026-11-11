import { supabase } from '../services/supabase';

function dataParaBanco(texto) {
  const [d, m, a] = String(texto).split('/');
  return `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function dataParaApp(iso) {
  const [a, m, d] = String(iso).split('-');
  return `${d}/${m}/${a}`;
}

function paraNumero(valor) {
  const texto = String(valor ?? '').replace(/\s/g, '');
  const normalizado = texto.includes(',')
    ? texto.replace(/\./g, '').replace(',', '.')
    : texto;
  const n = Number(normalizado);
  return Number.isFinite(n) ? n : 0;
}

function doBanco(linha) {
  return {
    id: String(linha.id),
    placa: linha.placa_do_veiculo,
    data: dataParaApp(linha.data_da_viagem),
    hodometro: linha.hodometro,
    numeroViagem: linha.numero_viagem,
    valor: linha.valor_da_viagem,
    Produtor: linha.nome_do_produtor,
    cancelada: linha.cancelada,
    hodometroCancelamento: linha.hodometro_cancelamento,
    motivoCancelamento: linha.motivo_cancelamento,
  };
}

function paraBanco(v) {
  const linha = {
    placa_do_veiculo: v.placa,
    data_da_viagem: dataParaBanco(v.data),
    hodometro: paraNumero(v.hodometro),
    numero_viagem: String(v.numeroViagem),
    valor_da_viagem: paraNumero(v.valor),
    nome_do_produtor: v.Produtor,
    cancelada: !!v.cancelada,
  };
  if (v.cancelada) {
    linha.hodometro_cancelamento = paraNumero(v.hodometroCancelamento);
    linha.motivo_cancelamento = v.motivoCancelamento ?? null;
  }
  return linha;
}

export async function listarViagens() {
  const { data, error } = await supabase
    .from('nova_viagem')
    .select('*')
    .order('data_da_viagem', { ascending: false })
    .order('id', { ascending: false });

  if (error) throw error;
  return data.map(doBanco);
}

export async function adicionarViagem(viagem) {
  const { data, error } = await supabase
    .from('nova_viagem')
    .insert(paraBanco(viagem))
    .select()
    .single();

  if (error) throw error;
  return doBanco(data);
}

export async function atualizarViagem(viagem) {
  const { data, error } = await supabase
    .from('nova_viagem')
    .update(paraBanco(viagem))
    .eq('id', viagem.id)
    .select()
    .single();

  if (error) throw error;
  return doBanco(data);
}