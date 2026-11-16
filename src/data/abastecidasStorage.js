import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { obterMotorista } from './sessao';

const chaveLocal = (motoristaId) => `@crepaldi:abastecidas:${motoristaId}`;

let sincronizando = null;

function comTimeout(promessa, ms = 5000) {
  return Promise.race([
    promessa,
    new Promise((_, rejeitar) =>
      setTimeout(() => rejeitar(new Error('Tempo esgotado')), ms)
    ),
  ]);
}

function gerarIdLocal() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function converterDataParaBanco(data) {
  const [dia, mes, ano] = String(data).split('/');
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

function converterDataParaTela(data) {
  if (!data) return data;
  const [ano, mes, dia] = String(data).split('-');
  return `${dia}/${mes}/${ano}`;
}

function ordenar(lista) {
  return [...lista].sort((a, b) => (b.criadoEm ?? 0) - (a.criadoEm ?? 0));
}

function exigirMotorista() {
  const motorista = obterMotorista();
  if (!motorista) {
    throw new Error('Motorista não identificado. Faça login novamente.');
  }
  return motorista;
}

function doBanco(l) {
  const valor = Number(l.valor_pago) || 0;
  const litros = Number(l.litros_abastecidos) || 0;

  return {
    id: l.id_local ?? `srv-${l.id}`,
    placa: l.placa_do_veiculo,
    data: converterDataParaTela(l.data),
    hodometro: Number(l.hodometro),
    combustivel: l.combustivel,
    total: valor,
    litros,
    precoLitro: litros > 0 ? valor / litros : 0,
    posto: l.posto,
    sincronizada: true,
    criadoEm: l.created_at ? new Date(l.created_at).getTime() : 0,
  };
}

function paraBanco(a, motoristaId) {
  return {
    id_local: a.id,
    motorista_id: motoristaId,
    placa_do_veiculo: a.placa,
    data: converterDataParaBanco(a.data),
    hodometro: a.hodometro,
    combustivel: a.combustivel,
    valor_pago: a.total,
    litros_abastecidos: a.litros,
    posto: a.posto,
  };
}

async function lerLocal(motoristaId) {
  const dados = await AsyncStorage.getItem(chaveLocal(motoristaId));
  return dados ? JSON.parse(dados) : [];
}

async function gravarLocal(motoristaId, lista) {
  await AsyncStorage.setItem(chaveLocal(motoristaId), JSON.stringify(lista));
}

export function sincronizarPendentes() {
  const motorista = obterMotorista();
  if (!motorista) return Promise.resolve();
  if (sincronizando) return sincronizando;

  sincronizando = (async () => {
    try {
      const locais = await lerLocal(motorista.id);
      const pendentes = locais.filter((a) => !a.sincronizada);

      for (const a of pendentes) {
        if (a.excluida) {
          const { error } = await comTimeout(
            supabase.from('abastecida').delete().eq('id_local', a.id)
          );
          if (error) throw error;

          const atual = await lerLocal(motorista.id);
          await gravarLocal(
            motorista.id,
            atual.filter((x) => !(x.id === a.id && x.alteradoEm === a.alteradoEm))
          );
        } else {
          const { error } = await comTimeout(
            supabase
              .from('abastecida')
              .upsert(paraBanco(a, motorista.id), { onConflict: 'id_local' })
          );
          if (error) throw error;

          const atual = await lerLocal(motorista.id);
          await gravarLocal(
            motorista.id,
            atual.map((x) =>
              x.id === a.id && x.alteradoEm === a.alteradoEm
                ? { ...x, sincronizada: true }
                : x
            )
          );
        }
      }
    } finally {
      sincronizando = null;
    }
  })();

  return sincronizando;
}

export async function listarAbastecidas() {
  const motorista = obterMotorista();
  if (!motorista) return [];

  try {
    await comTimeout(sincronizarPendentes(), 8000);
  } catch (e) {
    console.log('Sincronização pendente:', e.message ?? e);
  }

  const locais = await lerLocal(motorista.id);

  try {
    const { data, error } = await comTimeout(
      supabase
        .from('abastecida')
        .select('*')
        .eq('motorista_id', motorista.id)
    );
    if (error) throw error;

    const pendentes = locais.filter((a) => !a.sincronizada);
    const idsPendentes = new Set(pendentes.map((a) => a.id));

    const doServidor = data
      .map(doBanco)
      .filter((a) => !idsPendentes.has(a.id));

    const resultado = ordenar([...pendentes, ...doServidor]);
    await gravarLocal(motorista.id, resultado);
    return resultado.filter((a) => !a.excluida);
  } catch (e) {
    console.log('Sem conexão, usando dados do aparelho.');
    return ordenar(locais).filter((a) => !a.excluida);
  }
}

export async function adicionarAbastecida(abastecida) {
  const motorista = exigirMotorista();

  const nova = {
    placa: abastecida.placa,
    data: abastecida.data,
    hodometro: abastecida.hodometro,
    combustivel: abastecida.combustivel,
    total: abastecida.total,
    litros: abastecida.litros,
    precoLitro: abastecida.precoLitro,
    posto: abastecida.posto,
    id: gerarIdLocal(),
    sincronizada: false,
    alteradoEm: Date.now(),
    criadoEm: Date.now(),
  };

  const locais = await lerLocal(motorista.id);
  await gravarLocal(motorista.id, [nova, ...locais]);

  sincronizarPendentes().catch((e) =>
    console.log('Envio adiado:', e.message ?? e)
  );

  return nova;
}

export async function removerAbastecida(id) {
  const motorista = exigirMotorista();

  const locais = await lerLocal(motorista.id);
  const atualizadas = locais.map((a) =>
    a.id === id
      ? { ...a, excluida: true, sincronizada: false, alteradoEm: Date.now() }
      : a
  );
  await gravarLocal(motorista.id, atualizadas);

  sincronizarPendentes().catch((e) =>
    console.log('Exclusão adiada:', e.message ?? e)
  );

  return ordenar(atualizadas).filter((a) => !a.excluida);
}

export async function buscarUltimaAbastecida(placa) {
  const motorista = obterMotorista();
  if (!motorista) return null;

  const locais = await lerLocal(motorista.id);
  const doVeiculo = locais.filter(
    (a) => a.placa === placa && a.combustivel !== 'Arla 32' && !a.excluida
  );
  if (doVeiculo.length === 0) return null;

  return doVeiculo.reduce((maior, a) =>
    a.hodometro > maior.hodometro ? a : maior
  );
}

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
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatarNumero(valor, casas = 2) {
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}