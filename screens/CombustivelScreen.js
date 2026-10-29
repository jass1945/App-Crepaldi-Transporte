import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Motorista from '../components/motorista';
import {
  listarAbastecidas,
  removerAbastecida,
  formatarMoeda,
  formatarNumero,
} from '../src/data/abastecidasStorage';

// Média km/l de cada abastecida: km rodados desde a anterior da mesma placa / litros
function calcularConsumo(abastecidas) {
  const consumo = {};
  const porPlaca = {};

  abastecidas
    .filter((item) => item.combustivel !== 'Arla 32')
    .forEach((item) => {
      if (!porPlaca[item.placa]) porPlaca[item.placa] = [];
      porPlaca[item.placa].push(item);
    });

  Object.values(porPlaca).forEach((lista) => {
    lista.sort((a, b) => a.hodometro - b.hodometro);
    for (let i = 1; i < lista.length; i++) {
      const km = lista[i].hodometro - lista[i - 1].hodometro;
      if (km > 0 && lista[i].litros > 0) {
        consumo[lista[i].id] = km / lista[i].litros;
      }
    }
  });

  return consumo;
}

export default function CombustivelScreen({ navigation }) {
  const [abastecidas, setAbastecidas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function carregarAbastecidas() {
        try {
          const dados = await listarAbastecidas();
          setAbastecidas(dados);
        } catch (erro) {
          console.error('Erro ao carregar abastecidas:', erro);
        }
      }

      carregarAbastecidas();
    }, [])
  );

  const consumo = calcularConsumo(abastecidas);
  const totalGasto = abastecidas.reduce((soma, item) => soma + item.total, 0);
  const totalLitros = abastecidas
    .filter((item) => item.combustivel !== 'Arla 32')
    .reduce((soma, item) => soma + item.litros, 0);
  const medias = Object.values(consumo);
  const mediaGeral = medias.length
    ? medias.reduce((soma, valor) => soma + valor, 0) / medias.length
    : null;

  function confirmarRemocao(item) {
    const mensagem = `Excluir a abastecida de ${item.data} (${item.placa})?`;

    async function remover() {
      const dados = await removerAbastecida(item.id);
      setAbastecidas(dados);
    }

    if (Platform.OS === 'web') {
      if (window.confirm(mensagem)) remover();
      return;
    }

    Alert.alert('Excluir', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: remover },
    ]);
  }

  function renderizarAbastecida({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardTopo}>
          <Text style={styles.cardTitulo}>{item.placa}</Text>
          <Text style={styles.cardValor}>{formatarMoeda(item.total)}</Text>
        </View>

        <Text style={styles.cardData}>
          {item.data} · {item.posto}
        </Text>

        <View style={styles.tags}>
          <Text style={styles.tag}>{item.combustivel}</Text>
          <Text style={styles.tag}>{formatarNumero(item.litros)} L</Text>
          <Text style={styles.tag}>
            {formatarMoeda(item.precoLitro)}/L
          </Text>
          {item.tanqueCheio && <Text style={styles.tag}>Tanque cheio</Text>}
        </View>

        <View style={styles.cardRodape}>
          <Text style={styles.detalhe}>
            Hodômetro: {formatarNumero(item.hodometro, 0)} km
          </Text>
          {consumo[item.id] && (
            <Text style={styles.consumo}>
              {formatarNumero(consumo[item.id])} km/l
            </Text>
          )}
          <TouchableOpacity onPress={() => confirmarRemocao(item)}>
            <Ionicons name="trash-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={abastecidas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarAbastecida}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View>
            <Motorista />

            <View style={styles.resumo}>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoValor}>
                  {formatarMoeda(totalGasto)}
                </Text>
                <Text style={styles.resumoLabel}>Total gasto</Text>
              </View>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoValor}>
                  {formatarNumero(totalLitros, 0)} L
                </Text>
                <Text style={styles.resumoLabel}>Diesel</Text>
              </View>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoValor}>
                  {mediaGeral ? formatarNumero(mediaGeral) : '--'}
                </Text>
                <Text style={styles.resumoLabel}>Média km/l</Text>
              </View>
            </View>

            <Text style={styles.titulo}>Minhas abastecidas</Text>

            <TouchableOpacity
              style={styles.botao}
              onPress={() => navigation.navigate('NovaAbastecida')}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.textoBotao}>NOVA ABASTECIDA</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.mensagem}>
            Nenhuma abastecida cadastrada ainda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  lista: {
    padding: 24,
    paddingBottom: 32,
  },
  resumo: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  resumoItem: {
    flex: 1,
    alignItems: 'center',
  },
  resumoValor: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resumoLabel: {
    color: '#dbeafe',
    fontSize: 12,
    marginTop: 4,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  botao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  mensagem: {
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  cardValor: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cardData: {
    color: '#64748b',
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  detalhe: {
    flex: 1,
    color: '#64748b',
    fontSize: 13,
  },
  consumo: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
