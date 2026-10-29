
import { View, Text, Button, StyleSheet } from 'react-native';
import Motorista from '../components/motorista';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Motorista />

      <View style={styles.botao}>
        <Button
          title="Lançamento de viagens"
          color="#2563eb"
          onPress={() => navigation.navigate('Viagens')}
        />
      </View>

      <View style={styles.botao}>
        <Button
          title="Lançamento de Abastecidas"
          color="#2563eb"
          onPress={() => navigation.navigate('Abastecidas')}
        />
      </View>

      <View style={styles.botao}>
        <Button
          title="Meu Faturamento"
          color="#2563eb"
          onPress={() => navigation.navigate('Meu faturamento')}
        />
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
  botao: {
    marginTop: 20,
    borderRadius: 10,    
    overflow: 'hidden',
    
    
  },
});
