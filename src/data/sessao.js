let motoristaAtual = null;

export function definirMotorista(motorista) {
  motoristaAtual = motorista;
}

export function obterMotorista() {
  return motoristaAtual;
}

export function limparMotorista() {
  motoristaAtual = null;
}