import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { faturamentoMensal, formatarMoeda } from '../data';

const MESES = { SET: 'Setembro', AGO: 'Agosto', JUL: 'Julho' };

export default function FaturamentoScreen() {
  const [mes, setMes] = useState('SET');
  const dados = faturamentoMensal[mes];
  const entradas = Object.entries(dados.placas);
  const total = entradas.reduce((s, [, v]) => s + v, 0);
  const atingiu = total >= dados.meta;
  const escalaMax = 25000; // eixo do gráfico: 0 a 25K
  const alturaGrafico = 150;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Filtro de mês */}
      <View style={styles.chips}>
        {Object.keys(faturamentoMensal).map((m) => (
          <Pressable key={m} onPress={() => setMes(m)} style={[styles.chip, mes === m && styles.chipActive]}>
            <Text style={[styles.chipText, mes === m && { color: colors.white }]}>{m}</Text>
          </Pressable>
        ))}
      </View>

      {/* Cards: total + por placa */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
        <View style={[styles.card, { width: 200 }]}>
          <Text style={styles.cardLabel}>Total</Text>
          <Text style={styles.cardValue}>R$ {formatarMoeda(total)}</Text>
          <Text style={[styles.meta, atingiu && { color: '#2E9E5B' }]}>
            Meta: R$ {formatarMoeda(dados.meta)} {atingiu ? '✓' : ''}
          </Text>
        </View>
        {entradas.map(([placa, valor]) => (
          <View key={placa} style={[styles.card, { width: 170 }]}>
            <Text style={styles.cardLabel}>{placa}</Text>
            <Text style={styles.cardValue}>{formatarMoeda(valor)}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Gráfico de barras por veículo */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Faturamento por veículo</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <View style={{ height: alturaGrafico, justifyContent: 'space-between', marginRight: 8 }}>
            {[25, 20, 15, 10, 5].map((k) => (
              <Text key={k} style={styles.axis}>${k}K</Text>
            ))}
          </View>
          <View style={{ flex: 1, height: alturaGrafico, justifyContent: 'space-between' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.gridLine} />
            ))}
            <View style={styles.bars}>
              {entradas.map(([placa, valor]) => (
                <View key={placa} style={styles.barWrap}>
                  <View style={[styles.bar, { height: Math.min(valor / escalaMax, 1) * alturaGrafico }]} />
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 6 }}>
          <Text style={[styles.axis, { width: 52 }]}>{MESES[mes]}</Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            {entradas.map(([placa]) => (
              <Text key={placa} style={styles.barLabel}>{placa}</Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  chips: { flexDirection: 'row', marginBottom: 14 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EFEFEF', marginRight: 10 },
  chipActive: { backgroundColor: colors.navy },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.text },
  card: { borderWidth: 1, borderColor: colors.fieldBorder, borderRadius: radius.md, padding: 14, marginRight: 12 },
  cardLabel: { fontSize: 12, fontWeight: '600', color: colors.text },
  cardValue: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 4 },
  meta: { fontSize: 11, color: colors.textMuted, marginTop: 6 },
  chartCard: { borderWidth: 1, borderColor: colors.fieldBorder, borderRadius: radius.md, padding: 14, marginTop: 16 },
  chartTitle: { fontSize: 13, fontWeight: '600', color: colors.text },
  axis: { fontSize: 10, color: colors.textMuted },
  gridLine: { height: 1, backgroundColor: '#EEE' },
  bars: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  barWrap: { alignItems: 'center' },
  bar: { width: 40, backgroundColor: colors.chart, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  barLabel: { fontSize: 11, fontWeight: '600', color: colors.text },
});
