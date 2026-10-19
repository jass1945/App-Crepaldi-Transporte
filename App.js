import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, StatusBar as RNStatusBar, BackHandler, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

import { colors } from './src/theme';
import { motorista, viagensIniciais, abastecidasIniciais } from './src/data';
import { Header, TabBar } from './src/components/ui';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ListaScreen from './src/screens/ListaScreen';
import ViagemFormScreen from './src/screens/ViagemFormScreen';
import AbastecidaFormScreen from './src/screens/AbastecidaFormScreen';
import FaturamentoScreen from './src/screens/FaturamentoScreen';

const TITULOS = {
  viagens: 'Lançamentos',
  viagemForm: 'Nova viagem',
  viagemEdit: 'Editar viagem',
  abastecidas: 'Abastecidas',
  abastecidaForm: 'Nova abastecida',
  abastecidaView: 'Abastecida',
  faturamento: 'Faturamento',
};

export default function App() {
  const [logado, setLogado] = useState(false);
  // Pilha de navegação simples: [{ name, params }]
  const [pilha, setPilha] = useState([{ name: 'home' }]);
  const [viagens, setViagens] = useState(viagensIniciais);
  const [abastecidas, setAbastecidas] = useState(abastecidasIniciais);

  const atual = pilha[pilha.length - 1];
  const navigate = (name, params) => setPilha((p) => [...p, { name, params }]);
  const voltar = () => setPilha((p) => (p.length > 1 ? p.slice(0, -1) : p));
  const irPara = (name, params) => setPilha(name === 'home' ? [{ name: 'home' }] : [{ name: 'home' }, { name, params }]);

  // Botão "voltar" do Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (logado && pilha.length > 1) {
        voltar();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [logado, pilha]);

  function sair() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { setLogado(false); setPilha([{ name: 'home' }]); } },
    ]);
  }

  function renderTela() {
    switch (atual.name) {
      case 'home':
        return <HomeScreen navigate={navigate} />;
      case 'viagens':
        return (
          <ListaScreen
            tipo="viagem"
            itens={viagens}
            onNovo={() => navigate('viagemForm')}
            onAbrir={(v) => navigate('viagemEdit', { viagem: v })}
          />
        );
      case 'viagemForm':
      case 'viagemEdit':
        return (
          <ViagemFormScreen
            key={atual.params?.viagem?.id || 'nova'}
            viagem={atual.params?.viagem}
            onSalvar={(v) => {
              if (v.id) setViagens((l) => l.map((x) => (x.id === v.id ? v : x)));
              else setViagens((l) => [{ ...v, id: String(Date.now()), cancelada: false }, ...l]);
              Alert.alert('Pronto!', v.id ? 'Viagem atualizada.' : 'Viagem lançada com sucesso.');
              irPara('viagens');
            }}
            onCancelar={(v, c) => {
              setViagens((l) => l.map((x) => (x.id === v.id ? { ...x, cancelada: true, motivo: c.motivo } : x)));
              Alert.alert('Viagem cancelada');
              irPara('viagens');
            }}
          />
        );
      case 'abastecidas':
        return (
          <ListaScreen
            tipo="abastecida"
            itens={abastecidas}
            onNovo={() => navigate('abastecidaForm')}
            onAbrir={(a) => navigate('abastecidaView', { abastecida: a })}
          />
        );
      case 'abastecidaForm':
      case 'abastecidaView':
        return (
          <AbastecidaFormScreen
            abastecida={atual.params?.abastecida}
            onSalvar={(a) => {
              setAbastecidas((l) => [{ ...a, id: String(Date.now()) }, ...l]);
              Alert.alert('Pronto!', 'Abastecida registrada.');
              irPara('abastecidas');
            }}
          />
        );
      case 'faturamento':
        return <FaturamentoScreen />;
      default:
        return null;
    }
  }

  const topo = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) + 6 : 54;

  if (!logado) {
    return (
      <View style={[styles.root, { paddingTop: topo }]}>
        <StatusBar style="dark" />
        <LoginScreen onLogin={() => setLogado(true)} />
      </View>
    );
  }

  const abaAtiva = atual.name === 'home' ? 'home' : atual.name === 'faturamento' ? 'chart' : atual.name.endsWith('Form') ? 'add' : null;

  return (
    <View style={[styles.root, { paddingTop: topo }]}>
      <StatusBar style="dark" />
      <Header motorista={motorista} onMenu={sair} />

      {atual.name !== 'home' && (
        <Pressable onPress={voltar} style={styles.voltar} hitSlop={10}>
          <Feather name="chevron-left" size={18} color={colors.navy} />
          <Text style={styles.voltarText}>{TITULOS[atual.name]}</Text>
        </Pressable>
      )}

      <View style={{ flex: 1 }}>{renderTela()}</View>

      <TabBar
        active={abaAtiva}
        onHome={() => irPara('home')}
        onAdd={() => irPara('viagemForm')}
        onChart={() => irPara('faturamento')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  voltar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 },
  voltarText: { color: colors.navy, fontSize: 14, fontWeight: '600', marginLeft: 2 },
});
