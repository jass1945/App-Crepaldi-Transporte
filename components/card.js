
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CardViagem({ viagem, onEditar }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitulo}>
        Viagem {viagem.numeroViagem}
      </Text>

      <Text>Placa: {viagem.placa}</Text>
      <Text>Data: {viagem.data}</Text>
      <Text>Valor: R$ {viagem.valor}</Text>
      <Text>Produtor: {viagem.Produtor}</Text>

      <TouchableOpacity
      style={styles.botaoEditar}
      onPress={onEditar}>
        <Ionicons name="create-outline" size={18} color="#fff" />
        <Text style={styles.textoBotao}>Editar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
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
  botaoEditar: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: -30,
    gap: 8,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
