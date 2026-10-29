
import React, { useCallback, useState } from 'react';
import {View,Text,StyleSheet,ScrollView,Dimensions,} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { listarViagens } from '../src/data/viagensStorage';
import Motorista from '../components/motorista';

const larguraTela = Dimensions.get('window').width;

function converterValor(valor) {
  const texto = String(valor ?? '')
    .replace(/R\$/g, '')
    .replace(/\s/g, '');

  const normalizado = texto.includes(',')
    ? texto.replace(/\./g, '').replace(',', '.')
    : texto;

  const numero = Number(normalizado);

  return Number.isFinite(numero) ? numero : 0;
}


export default function FaturamentoScreen() {
  const [viagens, setViagens] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function carregarViagens() {
        try {
          const dados = await listarViagens();
          setViagens(dados);
        } catch (erro) {
          console.error('Erro ao carregar faturamento:', erro);
        }
      }

      carregarViagens();
    }, [])
  );

  
  const faturamentoPorPlaca = viagens.reduce((acumulado, viagem) => {
    const placa = viagem.placa || 'Sem placa';
    const valorTexto = String(viagem.valor ?? '')
      .replace(/R\$/g, '')
      .replace(/\s/g, '');

    const valor = Number(
      valorTexto.includes(',')
        ? valorTexto.replace(/\./g, '').replace(',', '.')
        : valorTexto
    );

    acumulado[placa] =
      (acumulado[placa] || 0) +
      (Number.isFinite(valor) ? valor : 0);

    return acumulado;
  }, {});

  const placas = Object.keys(faturamentoPorPlaca);

  const faturamentoTotal = Object.values(faturamentoPorPlaca)
    .reduce((total, valor) => total + valor, 0);

  const dadosGrafico = {
    labels: placas,
    datasets: [
      {
        data: placas.map((placa) => faturamentoPorPlaca[placa]),
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Motorista/>
      

      <View style={styles.cartao}>
        <Text style={styles.rotulo}>
          Faturamento total
        </Text>

        <Text style={styles.valorTotal}>
          {faturamentoTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
      </View>

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
          Nenhuma viagem cadastrada para exibir no gráfico.
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
    marginBottom: 20,
  },
  cartao: {
    backgroundColor: '#ffffff',
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
    gap:12,
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
  vazio: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 24,
  },
});
