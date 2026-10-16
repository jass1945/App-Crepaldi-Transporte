import { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Field, Select, Button } from '../components/ui';
import { placas, postos, agoraFormatado } from '../data';

export default function AbastecidaFormScreen({ abastecida, onSalvar }) {
  const somenteLeitura = !!abastecida;
  const [form, setForm] = useState(
    abastecida || { placa: placas[0], dataHora: agoraFormatado(), hodometro: '', posto: '', litros: '', valor: '' }
  );
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  function salvar() {
    const faltando = [];
    if (!form.hodometro) faltando.push('Hodômetro');
    if (!form.posto) faltando.push('Posto');
    if (!form.litros) faltando.push('Litros');
    if (!form.valor) faltando.push('Valor');
    if (faltando.length) return Alert.alert('Campos obrigatórios', faltando.join('\n'));
    onSalvar(form);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.row}>
        <Select label="Placa:" value={form.placa} options={placas} onChange={set('placa')} style={styles.col} />
        <Field label="Data hora" value={form.dataHora} onChangeText={set('dataHora')} style={styles.col} editable={!somenteLeitura} />
      </View>
      <View style={styles.row}>
        <Field label="Hodometro" placeholder="0.0" keyboardType="decimal-pad" value={form.hodometro} onChangeText={set('hodometro')} style={styles.col} editable={!somenteLeitura} />
        <Select label="Posto" value={form.posto} options={postos} onChange={set('posto')} style={styles.col} />
      </View>
      <View style={styles.row}>
        <Field label="Litros" placeholder="00000000" keyboardType="decimal-pad" value={form.litros} onChangeText={set('litros')} style={styles.col} editable={!somenteLeitura} />
        <Field label="Valor" placeholder="00" keyboardType="decimal-pad" value={form.valor} onChangeText={set('valor')} style={styles.col} editable={!somenteLeitura} />
      </View>

      {!somenteLeitura && <Button title="SALVAR" onPress={salvar} style={{ marginTop: 40 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 24, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },
});
