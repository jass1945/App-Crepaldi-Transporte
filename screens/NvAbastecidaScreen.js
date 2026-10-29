
import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { veiculos } from '../src/data/veiculos';
import {
  adicionarAbastecida,
  paraNumero,
  formatarMoeda,
} from '../src/data/abastecidasStorage';

const combustiveis = ['Diesel S10', 'Diesel S500', 'Arla 32'];

export default function NvAbastecidaScreen({ navigation }) {
  const [placa, setPlaca] = useState('');
  const [data, setData] = useState(new Date().toLocaleDateString('pt-BR'));
  const [hodometro, setHodometro] = useState('');
  const [combustivel, setCombustivel] = useState(combustiveis[0]);
  const [litros, setLitros] = useState('');
  const [precoLitro, setPrecoLitro] = useState('');
  const [posto, setPosto] = useState('');
  const [tanqueCheio, setTanqueCheio] = useState(true);
  const [erro, setErro] = useState('');

  const total = paraNumero(litros) * paraNumero(precoLitro);

  async function salvarAbastecida() {
    if (
      !placa.trim() ||
      !data.trim() ||
      !hodometro.trim() ||
      !litros.trim() ||
      !precoLitro.trim() ||
      !posto.trim()
    ) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (paraNumero(litros) <= 0 || paraNumero(precoLitro) <= 0) {
      setErro('Litros e preço por litro precisam ser maiores que zero.');
      return;
    }

    try {
      await adicionarAbastecida({
        placa,
        data,
        hodometro: paraNumero(hodometro),
        combustivel,
        litros: paraNumero(litros),
        precoLitro: paraNumero(precoLitro),
        total,
        posto: posto.trim(),
        tanqueCheio,
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a abastecida.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitulo}>
        Preencha os dados do abastecimento.
      </Text>

      <Text style={styles.label}>Placa do veículo</Text>
      <View style={styles.input}>
        <Picker
          selectedValue={placa}
          onValueChange={(itemValue) => setPlaca(itemValue)}
        >
          <Picker.Item label="Selecione uma placa" value="" />
          {veiculos.map((veiculo) => (
            <Picker.Item
              key={veiculo.id}
              label={veiculo.placa}
              value={veiculo.placa}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Data</Text>
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

      <Text style={styles.label}>Combustível</Text>
      <View style={styles.opcoes}>
        {combustiveis.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.opcao, combustivel === item && styles.opcaoAtiva]}
            onPress={() => setCombustivel(item)}
          >
            <Text
              style={[
                styles.textoOpcao,
                combustivel === item && styles.textoOpcaoAtiva,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.linha}>
        <View style={styles.coluna}>
          <Text style={styles.label}>Litros</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            value={litros}
            onChangeText={setLitros}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.coluna}>
          <Text style={styles.label}>Preço/litro (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            value={precoLitro}
            onChangeText={setPrecoLitro}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Valor total</Text>
        <Text style={styles.totalValor}>{formatarMoeda(total)}</Text>
      </View>

      <Text style={styles.label}>Posto</Text>
      <TextInput
        style={styles.input}
        value={posto}
        onChangeText={setPosto}
        autoCapitalize="words"
      />

      <TouchableOpacity
        style={styles.checkLinha}
        onPress={() => setTanqueCheio(!tanqueCheio)}
      >
        <View style={[styles.check, tanqueCheio && styles.checkAtivo]}>
          {tanqueCheio && <Text style={styles.checkMarca}>✓</Text>}
        </View>
        <Text style={styles.checkTexto}>Completou o tanque</Text>
      </TouchableOpacity>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity style={styles.botao} onPress={salvarAbastecida}>
        <Text style={styles.textoBotao}>SALVAR ABASTECIDA</Text>
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
  linha: {
    flexDirection: 'row',
    gap: 12,
  },
  coluna: {
    flex: 1,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  opcao: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  opcaoAtiva: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  textoOpcao: {
    color: '#334155',
    fontWeight: '600',
  },
  textoOpcaoAtiva: {
    color: '#fff',
  },
  totalBox: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  totalValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  checkLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkAtivo: {
    backgroundColor: '#2563eb',
  },
  checkMarca: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkTexto: {
    fontSize: 15,
    color: '#334155',
  },
  erro: {
    color: '#dc2626',
    marginBottom: 12,
    fontWeight: '600',
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
