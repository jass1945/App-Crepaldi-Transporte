import { View, Text, StyleSheet } from 'react-native';
import Motorista from '../components/motorista';

export default function FaturamentoScreen() {
  return (
    <View style={styles.container}>
        <Motorista/> 
      <Text style={styles.titulo}>Meus faturamneto</Text>
      <Text>Seus fretes cadastrados aparecerão aqui.</Text>
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
    marginBottom: 12,
  },
});