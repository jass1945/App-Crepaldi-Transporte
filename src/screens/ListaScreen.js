import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { MenuButton } from '../components/ui';
import { colors, radius } from '../theme';
import { dataCurta, placaCurta } from '../data';

// Tela de lista reutilizada para Viagens e Abastecidas
export default function ListaScreen({ tipo, itens, onNovo, onAbrir }) {
  const isViagem = tipo === 'viagem';
  const colunas = isViagem ? ['Data', 'Placa', 'Nº Viagem', 'Produtor'] : ['Data', 'Placa', 'Litros', 'Posto'];
  const flex = [1, 1.1, 1.3, 1.6];

  return (
    <View style={styles.container}>
      <MenuButton
        title={isViagem ? 'NOVA VIAGEM' : 'NOVA ABASTECIDA'}
        icon="plus-circle"
        tall
        onPress={onNovo}
      />

      <View style={styles.headRow}>
        {colunas.map((c, i) => (
          <Text key={c} style={[styles.headText, { flex: flex[i] }]}>{c}</Text>
        ))}
      </View>

      <FlatList
        data={itens}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum lançamento ainda.</Text>}
        renderItem={({ item }) => {
          const vals = isViagem
            ? [dataCurta(item.dataHora), placaCurta(item.placa), item.numero, item.produtor]
            : [dataCurta(item.dataHora), placaCurta(item.placa), item.litros, item.posto];
          const cor = item.cancelada ? colors.dangerText : colors.text;
          return (
            <Pressable
              onPress={() => onAbrir && onAbrir(item)}
              style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
            >
              {vals.map((v, i) => (
                <Text key={i} numberOfLines={1} style={[styles.cell, { flex: flex[i], color: cor }]}>
                  {v}
                </Text>
              ))}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 24 },
  headRow: { flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.text, marginTop: 6, marginBottom: 8 },
  headText: { fontSize: 12, color: colors.text, fontWeight: '500' },
  row: { flexDirection: 'row', backgroundColor: colors.field, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 10, marginBottom: 10 },
  cell: { fontSize: 12, fontWeight: '500', paddingRight: 4 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 30 },
});
