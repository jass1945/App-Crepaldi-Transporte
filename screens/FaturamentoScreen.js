import React, { useCallback, useState } from 'react';
import {View,  Text,  StyleSheet,  ScrollView,  Dimensions,  TouchableOpacity,} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { listarViagens } from '../src/data/viagensStorage';
import Motorista from '../components/motorista';

const larguraTela = Dimensions.get('window').width;

const META_FATURAMENTO = 25000;

const meses = [
  'Janeiro', 'Fevereiro', 'Março',
  'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro',
  'Outubro', 'Novembro', 'Dezembro'
];

function formatarReais(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function converterValor(valor) {
  const texto = String(valor ?? '').replace(/\s/g, '');

  const normalizado = texto.includes(',')
    ? texto.replace(/\./g, '').replace(',', '.')
    : texto;

  const numero = Number(normalizado);

  return Number.isFinite(numero)
    ? Math.round(numero * 100) / 100
    : 0;
}

export default function FaturamentoScreen() {
  const hoje = new Date();

  const [viagens, setViagens] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  useFocusEffect(
    useCallback(() => {
      async function carregarViagens() {
        try {
          const dados = await listarViagens();

          const viagensValidas = dados.filter(
            (viagem) => !viagem.cancelada);

          setViagens(viagensValidas);
        }
        catch (erro) {
          console.error('Erro ao carregar faturamento:', erro);}
      }

      carregarViagens();
    }, [])
  );

  const viagensFiltradas = viagens.filter((viagem) => {
    if (!viagem.data) return false;

    const partes = viagem.data.split('/');

    if (partes.length !== 3) return false;

    const mes = Number(partes[1]) - 1;
    const ano = Number(partes[2]);

    return mes === mesSelecionado && ano === anoSelecionado;
  });

  const faturamentoPorPlaca = viagensFiltradas.reduce(
    (acumulado, viagem) => {
      const placa = viagem.placa || 'Sem placa';
      const valor = converterValor(viagem.valor);

      acumulado[placa] = (acumulado[placa] || 0) + valor;

      return acumulado;
    },
    {}
  );

  const placas = Object.keys(faturamentoPorPlaca);

  const faturamentoTotal = Object.values(faturamentoPorPlaca)
    .reduce((total, valor) => total + valor, 0);

  const porcentagem = (faturamentoTotal / META_FATURAMENTO) * 100;
  const falta = Math.max(META_FATURAMENTO - faturamentoTotal, 0);
  const metaBatida = faturamentoTotal >= META_FATURAMENTO;
  const larguraBarra = Math.min(porcentagem, 100);

  const dadosGrafico = {
    labels: placas,
    datasets: [
      {
        data: placas.map((placa) => faturamentoPorPlaca[placa]),
      },
    ],
  };

  function mudarAno(valor) {
    setAnoSelecionado((ano) => ano + valor);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Motorista />      

      <View style={styles.seletorAno}>
        <TouchableOpacity
          style={styles.botaoAno}
          onPress={() => mudarAno(-1)}
        >
          <Text style={styles.textoBotaoAno}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.textoAno}>{anoSelecionado}</Text>

        <TouchableOpacity
          style={styles.botaoAno}
          onPress={() => mudarAno(1)}
          disabled={anoSelecionado >= hoje.getFullYear()}
        >
          <Text style={[
            styles.textoBotaoAno,
            anoSelecionado >= hoje.getFullYear() && styles.anoDesabilitado
          ]}>
            ›
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.listaMeses}
        contentContainerStyle={styles.conteudoMeses}
      >
        {meses.map((mes, index) => (
          <TouchableOpacity
            key={mes}
            style={[
              styles.botaoMes,
              mesSelecionado === index && styles.botaoMesAtivo,
            ]}
            onPress={() => setMesSelecionado(index)}
          >
            <Text
              style={[
                styles.textoMes,
                mesSelecionado === index && styles.textoMesAtivo,
              ]}
            >
              {mes.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.cartao}>
        <Text style={styles.rotulo}>
          Faturamento total - {meses[mesSelecionado]}
        </Text>

        <Text style={styles.rotulo}>
          Meta: {formatarReais(META_FATURAMENTO)}
        </Text>

        <Text style={styles.valorTotal}>
          {formatarReais(faturamentoTotal)}
        </Text>
      </View>

      <View style={styles.barraFundo}>
        <View
          style={[
            styles.barraPreenchida,
            { width: `${larguraBarra}%` },
          ]}
        />
      </View>

      <Text style={styles.textoMeta}>
        {metaBatida
          ? 'Meta batida!'
          : `${porcentagem.toFixed(0)}% da meta — faltam ${formatarReais(falta)}`}
      </Text>

      <Text style={styles.subtitulo}>
        Faturamento por placa
      </Text>

      {placas.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <BarChart
            data={dadosGrafico}
            width={Math.max(larguraTela - 48, placas.length * 90)}
            height={300}
            yAxisLabel="R$ "
            formatYLabel={(valor) =>
              Number(valor).toLocaleString('pt-BR', {
                maximumFractionDigits: 0,
              })
            }
            fromZero
            showValuesOnTopOfBars
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) =>
                `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) =>
                `rgba(51, 65, 85, ${opacity})`,
              propsForBackgroundLines: {
                stroke: '#e2e8f0',
              },
              barPercentage: 0.65,
            }}
            style={styles.grafico}
          />
        </ScrollView>
      ) : (
        <Text style={styles.vazio}>
          Nenhuma viagem cadastrada para {meses[mesSelecionado]} de {anoSelecionado}.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f4f6f9',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  seletorAno: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 25,
  },
  botaoAno: {
    padding: 10,
  },
  textoBotaoAno: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  textoAno: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  anoDesabilitado: {
    color: '#cbd5e1',
  },
  listaMeses: {
    marginBottom: 20,
    maxHeight: 45,
  },
  conteudoMeses: {
    gap: 8,
  },
  botaoMes: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  botaoMesAtivo: {
    backgroundColor: '#2563eb',
  },
  textoMes: {
    color: '#334155',
    fontWeight: 'bold',
  },
  textoMesAtivo: {
    color: '#fff',
  },
  cartao: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  rotulo: {
    color: '#64748b',
    fontSize: 14,
  },
  valorTotal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
  },
  grafico: {
    borderRadius: 12,
  },
  barraFundo: {
    height: 14,
    backgroundColor: '#e2e8f0',
    borderRadius: 7,
    overflow: 'hidden',
    marginTop: 16,
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 7,
  },
  textoMeta: {
    marginTop: 8,
    marginBottom: 20,
    color: '#334155',
  },
  vazio: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 24,
  },
});