import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { veiculos } from '../src/data/veiculos';
import {
  adicionarAbastecida,
  buscarUltimaAbastecida,
  paraNumero,
  formatarMoeda,
} from '../src/data/abastecidasStorage';

const combustiveis = ['Diesel S10', 'Diesel S500', 'Arla 32'];

export default function NvAbastecidaScreen({ navigation }) {
  const [placa, setPlaca] = useState('');
  const [data, setData] = useState(new Date().toLocaleDateString('pt-BR'));
  const [hodometro, setHodometro] = useState('');
  const [combustivel, setCombustivel] = useState(combustiveis[0]);
  const [valorPago, setValorPago] = useState('');
  const [precoLitro, setPrecoLitro] = useState('');
  const [posto, setPosto] = useState('');
  const [tanqueCheio, setTanqueCheio] = useState(true);
  const [erro, setErro] = useState('');
  const [ultima, setUltima] = useState(null);


  useEffect(() => {
    if (!placa) {
      setUltima(null);
      return;
    }
    buscarUltimaAbastecida(placa)
      .then((u) => {
        setUltima(u);
        if (u?.precoLitro) {
          setPrecoLitro(String(u.precoLitro.toFixed(2)).replace('.', ','));
        }
      })
      .catch(() => setUltima(null));
  }, [placa]);

  // Cálculos
  const ehArla = combustivel === 'Arla 32';
  const valor = paraNumero(valorPago);
  const preco = paraNumero(precoLitro);
  const kmAtual = paraNumero(hodometro);

  const litros = preco > 0 ? valor / preco : 0;
  const kmRodados = ultima && kmAtual > ultima.hodometro ? kmAtual - ultima.hodometro : 0;
  const mediaKmL = !ehArla && kmRodados > 0 && litros > 0 ? kmRodados / litros : null;
  const custoKm = !ehArla && kmRodados > 0 && valor > 0 ? valor / kmRodados : null;

  async function salvarAbastecida() {
    if (!placa.trim() || !data.trim() || !hodometro.trim() || !valorPago.trim() || !posto.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (valor <= 0) {
      setErro('O valor pago precisa ser maior que zero.');
      return;
    }

    if (ultima && kmAtual <= ultima.hodometro) {
      setErro(`O hodômetro precisa ser maior que o da última abastecida (${ultima.hodometro} km).`);
      return;
    }

    try {
      await adicionarAbastecida({
        placa,
        data,
        hodometro: kmAtual,
        combustivel,
        total: valor,
        precoLitro: preco || null,
        litros: litros || null,
        kmRodados: kmRodados || null,
        mediaKmL,
        custoKm,
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
      <Text style={styles.subtitulo}>Preencha os dados do abastecimento.</Text>

      <Text style={styles.label}>Placa do veículo</Text>
      <View style={styles.input}>
        <Picker selectedValue={placa} onValueChange={(itemValue) => setPlaca(itemValue)}>
          <Picker.Item label="Selecione uma placa" value="" />
          {veiculos.map((veiculo) => (
            <Picker.Item key={veiculo.id} label={veiculo.placa} value={veiculo.placa} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Data</Text>
      <TextInput style={styles.input} value={data} onChangeText={setData} keyboardType="numeric" />

      <Text style={styles.label}>Hodômetro (km)</Text>
      <TextInput
        style={styles.input}
        value={hodometro}
        onChangeText={setHodometro}
        keyboardType="numeric"
        placeholder={ultima ? `Última: ${ultima.hodometro} km` : ''}
      />

      <Text style={styles.label}>Combustível</Text>
      <View style={styles.opcoes}>
        {combustiveis.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.opcao, combustivel === item && styles.opcaoAtiva]}
            onPress={() => setCombustivel(item)}
          >
            <Text style={[styles.textoOpcao, combustivel === item && styles.textoOpcaoAtiva]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.linha}>
        <View style={styles.coluna}>
          <Text style={styles.label}>Valor pago (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            value={valorPago}
            onChangeText={setValorPago}
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

      {!ehArla && (
        <View style={styles.totalBox}>
          {!placa ? (
            <Text style={styles.resumoTexto}>Selecione a placa para calcular a média.</Text>
          ) : !ultima ? (
            <Text style={styles.resumoTexto}>
              Primeira abastecida deste veículo. A média aparece a partir da próxima.
            </Text>
          ) : (
            <>
              <View style={styles.resumoLinha}>
                <Text style={styles.resumoLabel}>Km rodados</Text>
                <Text style={styles.resumoValor}>{kmRodados > 0 ? `${kmRodados} km` : '—'}</Text>
              </View>
              <View style={styles.resumoLinha}>
                <Text style={styles.resumoLabel}>Litros (estimado)</Text>
                <Text style={styles.resumoValor}>
                  {litros > 0 ? `${litros.toFixed(2).replace('.', ',')} L` : '—'}
                </Text>
              </View>
              <View style={styles.resumoLinha}>
                <Text style={styles.resumoLabel}>Custo por km</Text>
                <Text style={styles.resumoValor}>{custoKm ? formatarMoeda(custoKm) : '—'}</Text>
              </View>
              <View style={styles.resumoLinha}>
                <Text style={styles.totalLabel}>Média</Text>
                <Text style={styles.totalValor}>
                  {mediaKmL ? `${mediaKmL.toFixed(2).replace('.', ',')} km/l` : '—'}
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      <Text style={styles.label}>Posto</Text>
      <TextInput style={styles.input} value={posto} onChangeText={setPosto} autoCapitalize="words" />

      <TouchableOpacity style={styles.checkLinha} onPress={() => setTanqueCheio(!tanqueCheio)}>
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
  container: { flexGrow: 1, backgroundColor: '#f8fafc', padding: 20 },
  subtitulo: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 8 },
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
  linha: { flexDirection: 'row', gap: 12 },
  coluna: { flex: 1 },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  opcao: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  opcaoAtiva: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  textoOpcao: { color: '#334155', fontWeight: '600' },
  textoOpcaoAtiva: { color: '#fff' },
  totalBox: { backgroundColor: '#dbeafe', borderRadius: 8, padding: 14, marginBottom: 18, gap: 6 },
  resumoLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resumoLabel: { fontSize: 14, color: '#1e3a8a' },
  resumoValor: { fontSize: 14, fontWeight: '600', color: '#1e3a8a' },
  resumoTexto: { fontSize: 14, color: '#1e3a8a' },
  totalLabel: { fontSize: 15, fontWeight: '600', color: '#1e3a8a' },
  totalValor: { fontSize: 20, fontWeight: 'bold', color: '#1e3a8a' },
  checkLinha: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
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
  checkAtivo: { backgroundColor: '#2563eb' },
  checkMarca: { color: '#fff', fontWeight: 'bold' },
  checkTexto: { fontSize: 15, color: '#334155' },
  erro: { color: '#dc2626', marginBottom: 12, fontWeight: '600' },
  botao: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});