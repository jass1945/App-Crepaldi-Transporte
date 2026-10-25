
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Motorista() {
  return (
    <View style={styles.card}>      

      <View style={styles.info}>

        <Text style={styles.detalhe}>
            Bem vindo
        </Text>

        <Text style={styles.nome}>
          Fulano Da Silva
        </Text>

        <Text style={styles.detalhe}>
          Periodo: Diurno
        </Text>

        <Text style={styles.detalhe}>
          Unidade: NVZ.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  detalhe: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },
});
