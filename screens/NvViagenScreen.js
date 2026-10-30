
import React, { useState, useEffect  } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { veiculos } from '../src/data/veiculos';
import { adicionarViagem, atualizarViagem } from '../src/data/viagensStorage';

export default function NvViagenScreen({navigation, route }) {
  const [placa, setPlaca] = useState('');
  const [data, setData] = useState(new Date().toLocaleDateString('pt-BR'));
  const [hodometro, setHodometro] = useState('');
  const [numeroViagem, setNumeroViagem] = useState('');
  const [valor, setValor] = useState('');
  const [Produtor, setProdutor] = useState('');

  const viagem = route?.params?.viagem;

useEffect(() => {
  if (viagem) {
    setPlaca(viagem.placa ?? '');
    setData(viagem.data ?? '');
    setHodometro(String(viagem.hodometro ?? ''));
    setNumeroViagem(String(viagem.numeroViagem ?? ''));
    setValor(String(viagem.valor ?? ''));
    setProdutor(viagem.Produtor ?? '');
  }
}, [viagem]);

  async function salvarViagem() {
    if (
      !placa.trim() ||
      !data.trim() ||
      !hodometro.trim() ||
      !numeroViagem.trim() ||
      !valor.trim() ||
      !Produtor.trim()
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
    const dadosViagem ={
      placa,
      data,
      hodometro,
      numeroViagem,
      valor,
      Produtor,
    };
    if (viagem) {
      await atualizarViagem({
        ...dadosViagem,
        id: viagem.id,
      });

    Alert.alert(
      'Sucesso',
      'Viagem atualizada!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
    } else {
      await adicionarViagem(dadosViagem);      

    Alert.alert('Sucesso', 'Viagem registrada!',
      [{text: 'ok', onPress:()=> navigation.goBack()}]
    );}
    
  }catch (erro) {
    Alert.alert('Erro', 'Não foi possível salvar a viagem.');
  }
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

      <Text style={styles.label}>Nome do Produtor</Text>
      <TextInput
        style={styles.input}
        value={Produtor}
        onChangeText={setProdutor}
        autoCapitalize="words"
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={salvarViagem}
      >
        <Text style={styles.textoBotao}>{viagem ? 'SALVAR ALTERAÇÕES' : 'SALVAR VIAGEM'}</Text>
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
