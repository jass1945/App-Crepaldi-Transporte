import { View, StyleSheet } from 'react-native';
import { MenuButton } from '../components/ui';

export default function HomeScreen({ navigate }) {
  return (
    <View style={styles.container}>
      <MenuButton title="LANÇAMENTO DE VIAGENS" onPress={() => navigate('viagens')} />
      <MenuButton title="LANÇAMENTO DE ABASTECIDA" onPress={() => navigate('abastecidas')} />
      <MenuButton title="MEU FATURAMENTO" onPress={() => navigate('faturamento')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 28 },
});
