import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Motorista from '../components/motorista';
import { listarViagens } from '../src/data/viagensStorage';

export default function ViagensScreen({ navigation }) {
  const [viagens, setViagens] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function carregarViagens() {
        try {
          const dados = await listarViagens();
          setViagens(dados);
        } catch (erro) {
          console.error('Erro ao carregar viagens:', erro);
        }
      }

      carregarViagens();
    }, [])
  );

  function renderizarViagem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          Viagem {item.numeroViagem}
        </Text>

        <Text>Placa: {item.placa}</Text>
        <Text>Data: {item.data}</Text>
        <Text>Valor: R$ {item.valor}</Text>
        <Text>Produtor: {item.Produtor}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Motorista />

      <Text style={styles.titulo}>Meus fretes</Text>

      <Button
        title="NOVA VIAGEM"
        onPress={() => navigation.navigate('NovaViagem')}
        color="#2563eb"
      />

      <FlatList
        data={viagens}
        keyExtractor={(item) => item.id}
        renderItem={renderizarViagem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.mensagem}>
            Nenhuma viagem cadastrada ainda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f4f6f9',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  lista: {
    paddingTop: 16,
    paddingBottom: 24,
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
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
});