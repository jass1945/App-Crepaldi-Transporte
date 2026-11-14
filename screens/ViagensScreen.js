import React, { useCallback, useState } from 'react';
import {  View,  Text,  StyleSheet,  Button,  FlatList,  TouchableOpacity,  ActivityIndicator,  Alert,} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Motorista from '../components/motorista';
import { listarViagens, sincronizarPendentes } from '../src/data/viagensStorage';
import CardViagem from '../components/card';

export default function ViagensScreen({ navigation }) {
  const [viagens, setViagens] = useState([]);
  const [sincronizando, setSincronizando] = useState(false);

  async function carregarViagens() {
    try {
      const dados = await listarViagens();
      setViagens(dados);
      return dados;
    } catch (erro) {
      console.error('Erro ao carregar viagens:', erro);
      return [];
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarViagens();
    }, [])
  );

  async function sincronizar() {
    if (sincronizando) return;

    setSincronizando(true);
    try {
      await sincronizarPendentes();
      const dados = await carregarViagens();
      const faltando = dados.filter((v) => v.sincronizada === false).length;

      if (faltando > 0) {
        Alert.alert(
          'Sincronização',
          `${faltando} viagem(ns) ainda não foi enviada. Verifique a internet e tente de novo.`
        );
      }
    } catch (erro) {
      Alert.alert(
        'Sem conexão',
        'Não foi possível sincronizar agora. Tente novamente quando tiver internet.'
      );
    } finally {
      setSincronizando(false);
    }
  }

  function renderizarViagem({ item }) {
    return (
      <CardViagem
        viagem={item}
        onEditar={() => navigation.navigate('NovaViagem', { viagem: item })}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Motorista />

      <View style={styles.linhaTitulo}>
        <Text style={styles.titulo}>Meus fretes</Text>

        <TouchableOpacity
          style={styles.botaoSync}
          onPress={sincronizar}
          disabled={sincronizando}
        >
          {sincronizando ? (
            <ActivityIndicator size="small" color="#2563eb" />) :
             (<Ionicons name="sync-outline" size={20} color="#2563eb" />)
            }
        </TouchableOpacity>
      </View>

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
  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  botaoSync: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
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
});