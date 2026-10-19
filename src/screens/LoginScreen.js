import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { Field, Button } from '../components/ui';
import { colors } from '../theme';

function mascaraCpf(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function LoginScreen({ onLogin }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState('');

  function entrar() {
    if (cpf.replace(/\D/g, '').length !== 11) return setErro('Informe um CPF válido.');
    if (!senha) return setErro('Informe sua senha.');
    setErro('');
    onLogin({ cpf, lembrar });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={{ marginTop: 60, marginBottom: 28 }}>
          <Logo size={86} />
        </View>

        <Text style={styles.title}>Login Motorista</Text>
        <Text style={styles.subtitle}>Insira seu CPF autorizado</Text>

        <Field
          placeholder="000.000.000-00"
          keyboardType="number-pad"
          value={cpf}
          onChangeText={(t) => setCpf(mascaraCpf(t))}
          style={{ marginBottom: 12 }}
        />
        <Field placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} style={{ marginBottom: 10 }} />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Button title="Continuar" onPress={entrar} style={{ marginTop: 4 }} />

        <Pressable style={styles.check} onPress={() => setLembrar(!lembrar)}>
          <Feather name={lembrar ? 'check-square' : 'square'} size={20} color={colors.text} />
          <Text style={styles.checkText}>Lembrar login</Text>
        </Pressable>

        <Text style={styles.terms}>
          Ao clicar em continuar, você concorda com os nossos{'\n'}
          <Text style={styles.termsBold}>Termos de Serviço</Text> e com a{' '}
          <Text style={styles.termsBold}>Política de Privacidade</Text>
        </Text>

        <Text style={styles.hint}>Demonstração: qualquer CPF com 11 dígitos e qualquer senha</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 26, paddingBottom: 40, backgroundColor: colors.bg, flexGrow: 1 },
  title: { textAlign: 'center', fontSize: 15, fontWeight: '700', color: colors.text },
  subtitle: { textAlign: 'center', fontSize: 13, color: colors.text, marginBottom: 22, marginTop: 2 },
  erro: { color: colors.dangerText, fontSize: 12, marginBottom: 8 },
  check: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  checkText: { marginLeft: 10, fontSize: 13, color: colors.text },
  terms: { textAlign: 'center', fontSize: 11, color: colors.textMuted, marginTop: 24, lineHeight: 17 },
  termsBold: { color: colors.text },
  hint: { textAlign: 'center', fontSize: 10, color: '#BBB', marginTop: 30 },
});
