// Dados fictícios para a apresentação.
// Na próxima etapa isso será substituído pelo banco local (PowerSync + PostgreSQL).

export const motorista = {
  nome: 'Fulano da Silva',
  cpf: '00000000000',
  periodo: 'Diurno',
  unidade: 'NVZ.',
};

export const placas = ['12-AAA1A22', '15-BBB3B44'];

export const postos = ['Rede Vale', 'Posto Morro Grande', 'Posto Ipiranga BR-101'];

export const viagensIniciais = [
  { id: '1', placa: '12-AAA1A22', dataHora: '10/05/2026 15h00', hodometro: '18200.00', numero: '34114455', valor: '745,85', produtor: 'JOSE MATOS DA SILVA', cancelada: false },
  { id: '2', placa: '12-AAA1A22', dataHora: '08/05/2026 09h30', hodometro: '18050.00', numero: '34115897', valor: '483,62', produtor: 'MARIA DOS SANTOS', cancelada: true, motivo: 'Carga não liberada' },
  { id: '3', placa: '12-AAA1A22', dataHora: '07/05/2026 14h10', hodometro: '17920.00', numero: '34111488', valor: '622,50', produtor: 'MATEUS SICLANO', cancelada: false },
];

export const abastecidasIniciais = [
  { id: '1', placa: '12-AAA1A22', dataHora: '10/05/2026 07h10', hodometro: '18180.0', posto: 'Rede Vale', litros: '100,55', valor: '612,35' },
  { id: '2', placa: '12-AAA1A22', dataHora: '06/05/2026 06h45', hodometro: '17700.0', posto: 'Rede Vale', litros: '100,55', valor: '612,35' },
  { id: '3', placa: '15-BBB3B44', dataHora: '04/05/2026 18h20', hodometro: '52310.0', posto: 'Rede Vale', litros: '100,55', valor: '612,35' },
];

// Faturamento mensal por placa (mock para o gráfico)
export const faturamentoMensal = {
  SET: { meta: 25000, placas: { 'AAA-1A22': 14899.6, 'BBB-3B44': 10816.29 } },
  AGO: { meta: 25000, placas: { 'AAA-1A22': 12340.1, 'BBB-3B44': 11025.4 } },
  JUL: { meta: 25000, placas: { 'AAA-1A22': 13110.75, 'BBB-3B44': 9870.0 } },
};

export function agoraFormatado() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}h${p(d.getMinutes())}`;
}

export function formatarMoeda(v) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function dataCurta(dataHora) {
  // "10/05/2026 15h00" -> "10/05/26"
  const [data] = dataHora.split(' ');
  const [d, m, a] = data.split('/');
  return `${d}/${m}/${(a || '').slice(-2)}`;
}

export function placaCurta(placa) {
  // "12-AAA1A22" -> "AAA1A22"
  return placa.includes('-') ? placa.split('-')[1] : placa;
}
