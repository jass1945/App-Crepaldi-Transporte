
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CardViagem({ viagem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitulo}>
        Viagem {viagem.numeroViagem}
      </Text>

      <Text>Placa: {viagem.placa}</Text>
      <Text>Data: {viagem.data}</Text>
      <Text>Valor: R$ {viagem.valor}</Text>
      <Text>Produtor: {viagem.Produtor}</Text>
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
});
