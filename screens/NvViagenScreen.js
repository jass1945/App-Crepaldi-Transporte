
import React, { useState, useEffect  } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert, Modal} from 'react-native';
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
  const [modalCancelamento, setModalCancelamento] = useState(false);
  const [hodometroCancelamento, setHodometroCancelamento] = useState('');
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

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
        ...viagem,
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

  async function cancelarViagem() {
    if (!hodometroCancelamento.trim() || !motivoCancelamento.trim()){
      Alert.alert('Preencha o hodometro e motivo cancelamento.');
      return;    }
    try {
      await atualizarViagem({
        ...viagem, cancelada:true, hodometroCancelamento, motivoCancelamento,
      });
      setModalCancelamento(false);
      Alert.alert('sucesso', 'viagem cancelada!', [{text: 'ok', onPress:() => navigation.goBack()}]);

    }catch (erro){
      Alert.alert('erro', 'viagem nao cancelada.');
    }
  }

  return (
    <View style={{flex:1}}>
      
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
        {viagem && !viagem.cancelada &&(
          <TouchableOpacity style ={styles.botaoCancelar} onPress={() => setModalCancelamento(true)}>
            <Text style={styles.textoBotaoCancelar}>CANCELAR VIAGEM</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal 
      visible= {modalCancelamento}
      transparent={true}
      animationType='fade'
      onRequestClose={() => setModalCancelamento(false)}>
        <View style={styles.fundoModal}>
          <View style={styles.modal}>
            <Text style={styles.labelModal}>hodometro no cancelamento</Text>
            <TextInput 
            style={styles.inputModal}
            placeholder="digite o hodometro"
            keyboardType='numeric' 
            value={hodometroCancelamento}
            onChangeText={setHodometroCancelamento}/>

            <Text style={styles.labelModal}>motivo do cancelamento</Text>
            <TextInput 
            style={[styles.inputModal, styles.inputMotivo]}          
            multiline
            value={motivoCancelamento}
            onChangeText={setMotivoCancelamento}/>

            <TouchableOpacity style={styles.botaoConfirmarCancelamento} onPress={cancelarViagem}>
              <Text style= {styles.textoBotaoCancelar}>CONFIRMAR CANCELAMENTO</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style= {styles.botaoFecharModal}
              onPress={() => setModalCancelamento(false)}>
                <Text style={styles.textoBotaoFechar}>VOLTAR</Text>
              </TouchableOpacity>
            

          </View>
        </View>

      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
    paddingBottom: 60,
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
  botaoCancelar: {
  backgroundColor: '#dc2626',
  padding: 14,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},

textoBotaoCancelar: {
  color: '#fff',
  fontWeight: 'bold',
},

fundoModal: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},

modal: {
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
},

tituloModal: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#dc2626',
  marginBottom: 20,
},

labelModal: {
  fontWeight: 'bold',
  marginBottom: 6,
},

inputModal: {
  borderWidth: 1,
  borderColor: '#cbd5e1',
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
},

inputMotivo: {
  height: 90,
  textAlignVertical: 'top',
},

botaoConfirmarCancelamento: {
  backgroundColor: '#dc2626',
  padding: 14,
  borderRadius: 8,
  alignItems: 'center',
},

botaoFecharModal: {
  padding: 12,
  alignItems: 'center',
  marginTop: 5,
},

textoBotaoFechar: {
  color: '#64748b',
  fontWeight: 'bold',
},
});
