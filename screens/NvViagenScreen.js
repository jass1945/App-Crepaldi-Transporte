
import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { veiculos } from './src/data/veiculos';

export default function NvViagenScreen() {
  const [placa, setPlaca] = useState('');
  const [data, setData] = useState(new Date().toLocaleDateString('pt-BR'));
  const [hodometro, setHodometro] = useState('');
  const [numeroViagem, setNumeroViagem] = useState('');
  const [valor, setValor] = useState('');

  function salvarViagem() {
    if (
      !placa.trim() ||
      !data.trim() ||
      !hodometro.trim() ||
      !numeroViagem.trim() ||
      !valor.trim()
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    Alert.alert('Sucesso', 'Viagem registrada!');

    setPlaca('');
    setData('');
    setHodometro('');
    setNumeroViagem('');
    setValor('');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>      
      <Text style={styles.subtitulo}>
        Preencha os dados da viagem realizada.
      </Text>
      
      <Text style={styles.label}>Placa do veículo</Text>
      <View style={styles.input}>
        <Picker
          selectedValue={placa}
          onValueChange={(itemValue) => setPlaca(itemValue)}
        >
          <Picker.Item
            label="Selecione uma placa"
            value=""
          />
          {veiculos.map((veiculo) => (
            <Picker.Item
              key={veiculo.id}
              label={veiculo.placa}
              value={veiculo.placa}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Data da viagem</Text>
      <TextInput
        style={styles.input}      
        value={data}
        onChangeText={setData}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Hodômetro (km)</Text>
      <TextInput
        style={styles.input}
        value={hodometro}
        onChangeText={setHodometro}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Número da viagem</Text>
      <TextInput
        style={styles.input}        
        value={numeroViagem}
        onChangeText={setNumeroViagem}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Valor da viagem (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="00,00"
        value={valor}
        onChangeText={setValor}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={salvarViagem}
      >
        <Text style={styles.textoBotao}>SALVAR VIAGEM</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
  },
  botao: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
