import { View, Text, StyleSheet, Button } from 'react-native';
import Motorista from '../components/motorista';


export default function ViagensScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Motorista/>
      
      <Text style={styles.titulo}>Meus fretes</Text>
      <Text>Seus fretes cadastrados aparecerão aqui.</Text>

      <View style={styles.Botao}>
        <Button  title='NOVA VIAGEM'
        onPress={() => navigation.navigate('NovaViagem')}
        color= '#2563eb'/>
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
    marginBottom: 12,
  },
  Botao: {
    marginBottom: 12,    
  },
});