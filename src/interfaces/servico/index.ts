export interface IServico {
  id?: number | null;
  nome: string;
  descricao?: string | null;
  categoria_id: number | null;
  referencia?: string;
  valor: number;
  vigencia_dt?: Date;
}
