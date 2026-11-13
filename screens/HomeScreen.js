
import { View, Text, Button, StyleSheet } from 'react-native';
import Motorista from '../components/motorista';
import { encerrarSessao } from '../src/data/sessao';

export default function HomeScreen({ navigation }) {
  async function sair(){
    await encerrarSessao();
    const pai = navigation.getParent() ?? navigation;
    pai.reset({index: 0, routes: [{name:'Login'}]})
  }  
  return (
    <View style={styles.container}>
      <Motorista />
      <Text style={styles.titulo}>HOME</Text>

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

      <View style={styles.botaoSair}>
        <Button title="Sair" color="#dc2626" onPress={sair} />
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
  botaoSair:{
    position: 'absolute',
    top: 75,  
    right: 40,
    zIndex: 10,       
  },
});
