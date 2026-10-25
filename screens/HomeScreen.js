import { View, Text, StyleSheet } from 'react-native';
import Motorista from '../components/motorista';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Motorista/>

      <View style={styles.card}>
        <Text>Lançamento de viagens</Text>       
      </View>

      <View style={styles.card}>
        <Text>Lançamento de Abastecidas</Text>       
      </View>

      <View style={styles.card}>
        <Text>Meu Faturamento</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f4f6f9',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  numero: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 8,
  },
});