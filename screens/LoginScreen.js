
import React, { useState, useEffect } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,  StyleSheet,  Alert,  Image, Switch} from 'react-native';

import { validarLogin } from '../src/data/motoristaLogin';
import { definirMotorista, salvarSessao, carregarSessao } from '../src/data/sessao';

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [manter, setManter] = useState(true);
  const [verificando, setVerificando] = useState(true);

  useEffect(()=>{
    let ativo = true;

    async function restaurar(){
      try{
        const salvo = await carregarSessao();
        if (!ativo) return;

        if (salvo){
          definirMotorista(salvo);
          navigation.replace('Principal', {motorista: salvo});
          return;
        }        
      } catch (e){
        console.log('Erro ao restaurar sessão:', e);
      }

      if (ativo) setVerificando(false);
    }

    restaurar();
    return () => {
      ativo =false;
    };
  }, []);

  async function entrar() {
    if (!cpf || !senha) {
      Alert.alert('Atenção', 'Preencha o CPF e a senha.');
      return;
    }
    if (senha.length !== 4) {
      Alert.alert('Atenção', 'A senha deve ter 4 dígitos.');
      return;
    }

    const resultado = await validarLogin(cpf, senha);

    if (!resultado.sucesso) {
      Alert.alert('Erro', resultado.mensagem);
      return;
    }
    
    definirMotorista(resultado.motorista);
    if(manter){
      await salvarSessao(resultado.motorista);
    }
    navigation.replace('Principal', {
      motorista: resultado.motorista,
    });
  }
  if (verificando){
    return <View style={styles.container}/>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Bem-vindo!</Text>

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
        onChangeText={(texto) =>
          setSenha(texto.replace(/\D/g, '').slice(0, 4))
        }
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        onSubmitEditing={entrar}
      />
      <View style={styles.linhaManter}>
        <Switch value={manter} onValueChange={setManter} />
        <Text style={styles.textoManter}>Lembrar login</Text>
      </View>        

      <TouchableOpacity style={styles.botao} onPress={entrar}>
        <Text style={styles.textoBotao}>ENTRAR</Text>
      </TouchableOpacity>

      <Text style={styles.rodape}>
        Acesso exclusivo para motoristas previamente cadastrados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    justifyContent: 'flex-start',
    paddingTop: 85,
    padding: 28,
  },
  logo: {
    width: 220,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 2,
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
  linhaManter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  textoManter: {
    color: '#334155',
    fontSize: 15,
  },  
});