
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_VIAGENS = '@crepaldi:viagens';

export async function listarViagens() {
  const dados = await AsyncStorage.getItem(CHAVE_VIAGENS);
  return dados ? JSON.parse(dados) : [];
}

export async function adicionarViagem(viagem) {
  const viagens = await listarViagens();

  const novasViagens = [
    { ...viagem, id: String(Date.now()) },
    ...viagens,
  ];

  await AsyncStorage.setItem(
    CHAVE_VIAGENS,
    JSON.stringify(novasViagens)
  );

  return novasViagens;
}
