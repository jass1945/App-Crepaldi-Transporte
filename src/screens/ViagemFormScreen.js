import { useState } from 'react';
import { View, Text, ScrollView, Modal, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Field, Select, Button } from '../components/ui';
import { colors, radius } from '../theme';
import { placas, agoraFormatado } from '../data';

export default function ViagemFormScreen({ viagem, onSalvar, onCancelar }) {
  const editando = !!viagem;
  const [form, setForm] = useState(
    viagem || { placa: placas[0], dataHora: agoraFormatado(), hodometro: '', numero: '', valor: '', produtor: '' }
  );
  const [popup, setPopup] = useState(false);
  const [cancel, setCancel] = useState({ hodometro: '', motivo: '' });
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  function salvar() {
    const faltando = [];
    if (!form.hodometro) faltando.push('Hodômetro');
    if (!form.numero) faltando.push('Número da viagem');
    if (!form.valor) faltando.push('Valor');
    if (!editando && !form.produtor) faltando.push('Nome do produtor');
    if (faltando.length) return Alert.alert('Campos obrigatórios', faltando.join('\n'));
    onSalvar(form);
  }

  function confirmarCancelamento() {
    if (!cancel.motivo) return Alert.alert('Informe o motivo do cancelamento');
    setPopup(false);
    onCancelar(form, cancel);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {form.cancelada && (
        <View style={styles.badge}>
          <Feather name="alert-triangle" size={14} color={colors.dangerText} />
          <Text style={styles.badgeText}>Viagem cancelada{form.motivo ? ` — ${form.motivo}` : ''}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Select label="Placa:" value={form.placa} options={placas} onChange={set('placa')} style={styles.col} />
        <Field label="Data hora" value={form.dataHora} onChangeText={set('dataHora')} style={styles.col} />
      </View>
      <View style={styles.row}>
        <Field label="Hodometro" placeholder="0.0" keyboardType="decimal-pad" value={form.hodometro} onChangeText={set('hodometro')} style={styles.col} />
        <Field label="Numero da Viagem" placeholder="00000000" keyboardType="number-pad" value={form.numero} onChangeText={set('numero')} style={styles.col} />
      </View>
      <View style={styles.row}>
        <Field label="Valor" placeholder="00" keyboardType="decimal-pad" value={form.valor} onChangeText={set('valor')} style={styles.col} />
        <View style={styles.col} />
      </View>
      <Field label="Nome Produtor" value={form.produtor} onChangeText={set('produtor')} autoCapitalize="characters" />

      <View style={{ marginTop: 24 }}>
        {editando ? (
          !form.cancelada && (
            <>
              <Button title="SALVAR EDIÇÃO" variant="warning" onPress={salvar} />
              <Button title="CANCELAR VIAGEM" variant="danger" onPress={() => setPopup(true)} style={{ marginTop: 12 }} />
            </>
          )
        ) : (
          <Button title="SALVAR" onPress={salvar} />
        )}
      </View>

      {/* Pop-up de cancelamento */}
      <Modal transparent visible={popup} animationType="fade" onRequestClose={() => setPopup(false)}>
        <View style={styles.backdrop}>
          <View style={styles.popup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.popupTitle}>CANCELAR VIAGEM?</Text>
              <Feather name="alert-triangle" size={18} color={colors.dangerText} style={{ marginLeft: 8 }} />
            </View>
            <Field label="Hodometro" placeholder="0.0" keyboardType="decimal-pad" value={cancel.hodometro} onChangeText={(v) => setCancel({ ...cancel, hodometro: v })} />
            <Field label="Motivo" value={cancel.motivo} onChangeText={(v) => setCancel({ ...cancel, motivo: v })} />
            <Button title="Voltar" variant="outline" onPress={() => setPopup(false)} />
            <Button title="CANCELAR VIAGEM" variant="danger" onPress={confirmarCancelamento} style={{ marginTop: 10 }} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 24, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDE8EE', padding: 10, borderRadius: radius.sm, marginBottom: 16 },
  badgeText: { color: colors.dangerText, marginLeft: 8, fontSize: 12, fontWeight: '600', flexShrink: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  popup: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 18 },
  popupTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
});
