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
