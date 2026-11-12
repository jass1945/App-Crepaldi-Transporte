import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { obterMotorista } from './sessao';

const chaveLocal = (motoristaId) => `@crepaldi:viagens:${motoristaId}`;

let sincronizando = null;

function gerarIdLocal() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function dataParaBanco(texto) {
  const [d, m, a] = String(texto).split('/');
  return `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function dataParaApp(iso) {
  if (!iso) return '';
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

function ordenar(lista) {
  return [...lista].sort((x, y) => (y.criadoEm ?? 0) - (x.criadoEm ?? 0));
}

function doBanco(l) {
  return {
    id: l.id_local ?? `srv-${l.id}`,
    placa: l.placa_do_veiculo,
    data: dataParaApp(l.data_da_viagem),
    hodometro: l.hodometro,
    numeroViagem: l.numero_viagem,
    valor: l.valor_da_viagem,
    Produtor: l.nome_do_produtor,
    cancelada: l.cancelada,
    hodometroCancelamento: l.hodometro_cancelamento,
    motivoCancelamento: l.motivo_cancelamento,
    sincronizada: true,
    criadoEm: new Date(l.created_at).getTime(),
  };
}

function paraBanco(v, motoristaId) {
  return {
    id_local: v.id,
    motorista_id: motoristaId,
    placa_do_veiculo: v.placa,
    data_da_viagem: dataParaBanco(v.data),
    hodometro: paraNumero(v.hodometro),
    numero_viagem: String(v.numeroViagem),
    valor_da_viagem: paraNumero(v.valor),
    nome_do_produtor: v.Produtor,
    cancelada: !!v.cancelada,
    hodometro_cancelamento: v.cancelada
      ? paraNumero(v.hodometroCancelamento)
      : null,
    motivo_cancelamento: v.cancelada ? v.motivoCancelamento ?? null : null,
  };
}
function comTimeout(promessa, ms = 5000) {
  return Promise.race([
    promessa,
    new Promise((_, rejeitar) =>
      setTimeout(() => rejeitar(new Error('Tempo esgotado')), ms)
    ),
  ]);
}

async function lerLocal(motoristaId) {
  const dados = await AsyncStorage.getItem(chaveLocal(motoristaId));
  return dados ? JSON.parse(dados) : [];
}

async function gravarLocal(motoristaId, lista) {
  await AsyncStorage.setItem(chaveLocal(motoristaId), JSON.stringify(lista));
}

function exigirMotorista() {
  const motorista = obterMotorista();
  if (!motorista) {
    throw new Error('Motorista não identificado. Faça login novamente.');
  }
  return motorista;
}

export function sincronizarPendentes() {
  const motorista = obterMotorista();
  if (!motorista) return Promise.resolve();
  if (sincronizando) return sincronizando;

  sincronizando = (async () => {
    try {
      const locais = await lerLocal(motorista.id);
      const pendentes = locais.filter((v) => !v.sincronizada);

      for (const v of pendentes) {
        const { error } = await comTimeout(
          supabase
            .from('nova_viagem')
            .upsert(paraBanco(v, motorista.id), { onConflict: 'id_local' })
        );
        if (error) throw error;

        const atual = await lerLocal(motorista.id);
        await gravarLocal(
          motorista.id,
          atual.map((x) =>
            x.id === v.id && x.alteradoEm === v.alteradoEm
              ? { ...x, sincronizada: true }
              : x
          )
        );
      }
    } finally {
      sincronizando = null;
    }
  })();

  return sincronizando;
}

export async function listarViagens() {
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
        .from('nova_viagem')
        .select('*')
        .eq('motorista_id', motorista.id)
    );

    if (error) throw error;

    const pendentes = locais.filter((v) => !v.sincronizada);
    const idsPendentes = new Set(pendentes.map((v) => v.id));

    const doServidor = data
      .map(doBanco)
      .filter((v) => !idsPendentes.has(v.id));

    const resultado = ordenar([...pendentes, ...doServidor]);
    await gravarLocal(motorista.id, resultado);
    return resultado;
  } catch (e) {
    console.log('Sem conexão, usando dados do aparelho.');
    return ordenar(locais);
  }
}

export async function adicionarViagem(viagem) {
  const motorista = exigirMotorista();

  const nova = {
    ...viagem,
    id: gerarIdLocal(),
    cancelada: false,
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

export async function atualizarViagem(viagem) {
  const motorista = exigirMotorista();

  const locais = await lerLocal(motorista.id);
  const atualizada = {
    ...viagem,
    sincronizada: false,
    alteradoEm: Date.now(),
  };

  await gravarLocal(
    motorista.id,
    locais.map((v) => (v.id === viagem.id ? atualizada : v))
  );

  sincronizarPendentes().catch((e) =>
    console.log('Envio adiado:', e.message ?? e)
  );

  return atualizada;
}