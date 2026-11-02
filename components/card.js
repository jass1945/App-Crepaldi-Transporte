
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function CardViagem({ viagem, onEditar }) {
  const [tempoDisponivel, setTempoDisponivel] = useState(false);

  useEffect(() => {
    function verificarTempo() {
      if (!viagem.criadoEm) {
        setTempoDisponivel(false);
        return;
      }

      const tempoDecorrido = Date.now() - viagem.criadoEm;

      setTempoDisponivel(tempoDecorrido < 30000);
    }
    verificarTempo();

    const intervalo = setInterval(verificarTempo, 1000);

    return () => clearInterval(intervalo);
  }, [viagem.criadoEm]);  


  return (
    <View style={[styles.card, viagem.cancelada]}>
      <Text style={styles.cardTitulo}>
        Viagem {viagem.numeroViagem}
      </Text>
      {viagem.cancelada && (
        <Text style={styles.avisoCancelado}>CANCELADA</Text>
      )}

      <Text>Placa: {viagem.placa}</Text>
      <Text>Data: {viagem.data}</Text>
      <Text>Valor: R$ {viagem.valor}</Text>
      <Text>Produtor: {viagem.Produtor}</Text>    

    {!viagem.cancelada && tempoDisponivel && (
      <TouchableOpacity
        style={styles.botaoEditar}
        onPress={onEditar}
      >
        <Ionicons name="create-outline" size={18} color="#fff" />
        <Text style={styles.textoBotao}>Editar</Text>
      </TouchableOpacity>
    )}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
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
  avisoCancelado: {
    color: '#dc2626',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',    
    paddingVertical: 6,
    paddingHorizontal: 8,    
    marginTop: -30,      
  },
});
