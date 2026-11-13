
import { supabase } from '../services/supabase';

export async function listarVeiculos() {
  const { data, error } = await supabase
    .from('veiculos')
    .select('id, placa, modelo')
    .eq('ativo', true)
    .order('placa', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
