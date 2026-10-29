
const motoristas = [
  {
    nome: 'Fulano da Silva',
    cpf: '12345678900',
    senha: '1234',
  },
  {
    nome: 'Siclano da Silva',
    cpf: '14725836900',
    senha: '1234',
  },
];

export function validarLogin(cpf, senha) {
  const cpfLimpo = cpf.replace(/\D/g, '');

  const motorista = motoristas.find(
    (item) =>
      item.cpf === cpfLimpo &&
      item.senha === senha
  );

  return Boolean(motorista);
}
