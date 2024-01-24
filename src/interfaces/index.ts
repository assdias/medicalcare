export interface PostFileFormDataBody {
  [key: string]: string | Blob;
}

export enum tipo {
  BENEFICIARIO = 'Beneficiário',
  PRESTADOR = 'Prestador',
  OPERADOR = 'Operador',
}

export enum msg {
  REQUERIDO = 'Campo obrigatório',
  PESQUISA = 'Digite no minimo 3 letras ou números',
}

export interface IResultAbstract {
  itemsReceived: number;
  curPage: number;
  nextPage: number;
  prevPage: null;
  offset: number;
  itemsTotal: number;
  pageTotal: number;
}

export interface ISoftDelete {
  id: number;
  delete_at: Date;
}

export interface IToken {
  authToken: string;
}

export interface IUser {
  id: number;
  created_at: number;
  name: string;
  email: string;
  group_id: number;
  cidade_id: number;
  cpf_cnpj: string;
  tipo: string;
  whatsapp: string;
  fone: string;
  image: IImage;
  cidade: ICidade;
}

export interface IServico {
  id: number;
  created_at: number;
  categoria_id: number;
  prestador_id: number;
  referencia: string;
  nome: string;
  observacao: string;
  valor: number;
  vigencia_dt: number;
  prestador: IPrestador;
  categoria: ICategoria;
}

export interface IPrestador extends IUser {
  classificacao_id: number;
  especialidade_id: IEspecialidadeId[][];
  location: ILocation;
  logradouro: string;
  logradouro_numero: string;
  logradouro_complemento: string;
  bairro: string;
  cep: number;
  classificacao: IClassificacao;
}

export interface IEspecialidadeId {
  nome: string;
}

export interface ILocation {
  type: string;
  data: IData;
}

export interface IData {
  lng: number;
  lat: number;
}

export interface IImage {
  url: string;
}

export interface ICidade {
  id: number;
  nome: string;
  uf: string;
}

export interface IClassificacao {
  id: number;
  nome: string;
}

export interface IEspecialidade {
  id: number;
  nome: string;
}

export interface ICategoria {
  id: number;
  nome: string;
}

export interface ISolicitacao {
  id: number | null;
  created_at: Date;
  prestador_id: number;
  user_id: number;
  servico_id: number;
  protocolo: string;
  solicitacao_dt: Date;
  valor: number;
  vigencia_preco_dt: Date;
  operador_id: number;
  cidade_id: number;
  categoria_id: number;
  especialidade_id: number;
  delete_at: Date;
}
