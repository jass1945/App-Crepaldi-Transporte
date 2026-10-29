
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Motorista() {
  return (
    <View style={styles.card}>

      <View style={styles.info}>
        <Text style={styles.detalhe}>
          Bem-vindo
        </Text>

        <Text style={styles.nome}>
          Fulano da Silva
        </Text>
      </View>

      <View style={styles.informacoes}>

        <View style={styles.item}>
          <View style={styles.linhaTitulo}>
            <Ionicons name="sunny-outline" size={19} color="#E5AC19" />
            <Text style={styles.rotulo}>PERÍODO</Text>
          </View>
          <Text style={styles.valor}>Diurno</Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.item}>
          <View style={styles.linhaTitulo}>
            <Ionicons name="business-outline" size={19} color="#101653" />
            <Text style={styles.rotulo}>UNIDADE</Text>
          </View>
          <Text style={styles.valor}>NVZ.</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
    marginTop: 6,
    marginBottom: 8,
    padding: 20,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  info: {
    marginBottom: 20,
  },

  detalhe: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7B8498',
    marginBottom: 4,
  },

  nome: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#101653',
  },

  informacoes: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9ECF3',
    paddingTop: 15,
  },

  item: {
    flex: 1,
    paddingHorizontal: 4,
  },

  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  rotulo: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7B8498',
    letterSpacing: 0.5,
  },

  valor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101653',
  },

  separador: {
    width: 1,
    height: 43,
    backgroundColor: '#E9ECF3',
    marginHorizontal: 10,
  },
});
