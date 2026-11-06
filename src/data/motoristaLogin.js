import { supabase } from '../services/supabase';

export async function validarLogin(cpf, senha) {
  const cpfLimpo = String(cpf).replace(/\D/g, '');
  const senhaTexto = String(senha);

  if (cpfLimpo.length !== 11 || !/^\d{4}$/.test(senhaTexto)) {
    return {
      sucesso: false,
      mensagem: 'Informe um CPF válido e uma senha de 4 dígitos.',
    };
  }

  const { data, error } = await supabase.rpc(
    'validar_login_motorista',
    {
      p_cpf: cpfLimpo,
      p_senha: senhaTexto,
    }
  );

  if (error) {
    console.log('Erro ao validar login:', error.message);

    return {
      sucesso: false,
      mensagem: 'Não foi possível realizar o login.',
    };
  }

  if (!data || data.length === 0) {
    return {
      sucesso: false,
      mensagem: 'CPF ou senha incorretos.',
    };
  }

  return {
    sucesso: true,
    motorista: data[0],
  };
}