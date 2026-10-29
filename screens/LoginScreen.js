
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

import { validarLogin } from '../src/data/motoristaLogin';

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  function entrar() {
    if (!cpf || !senha) {
      Alert.alert('Atenção', 'Preencha o CPF e a senha.');
      return;
    }

    if (!validarLogin(cpf, senha)) {
      Alert.alert('Erro', 'CPF ou senha incorretos.');
      return;
    }

    navigation.replace('Principal');
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Bem-vindo!</Text>
      <Text style={styles.subtitulo}>
        Entre com seu CPF e sua senha.
      </Text>

      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu CPF"
        value={cpf}
        onChangeText={(texto) =>
          setCpf(texto.replace(/\D/g, '').slice(0, 11))
        }
        keyboardType="numeric"
        maxLength={11}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        onSubmitEditing={entrar}
      />

      <TouchableOpacity style={styles.botao} onPress={entrar}>
        <Text style={styles.textoBotao}>ENTRAR</Text>
      </TouchableOpacity>

      <Text style={styles.rodape}>
        Acesso exclusivo para motoristas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    justifyContent: 'center',
    padding: 28,
  },
  logo: {
    width: 220,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rodape: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 24,
  },
});
