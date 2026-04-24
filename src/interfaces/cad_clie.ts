export interface CadClie {
  // Identificação e Básicos
  CODIGO: number;
  COD_SITE?: number;
  FIS_JUR?: string; // 'F' ou 'J'
  NOME: string;
  APELIDO: string;
  CPF: string;
  RG?: string;
  CMC: string; // Inscrição Municipal
  CONTRIB: 'N' | 'S' | 'I'; // N=Não; S=Sim; I=Isento
  ATIV_EMPR: 'Q' | 'D' | 'I' | 'O' | 'M' | 'E' | 'F' | 'P' | 'R' | 'U' | 'T' | 'N';
  DATA_NASC?: string | Date;
  SITE: string;
  EMAIL_FISCAL: string;

  // Endereço Principal (Residencial/Comercial)
  ENDERECO: string;
  NUMERO: string;
  COMPLEMENTO?: string;
  BAIRRO: string;
  CEP: string;
  CIDADE: string;
  ESTADO: string;
  PAIS: string;

  // Contatos
  TELEFONE_COM?: string;
  TELEFONE_RES?: string;
  CELULAR?: string;
  TOLLFREE?: string;
  EMAIL?: string;

  // Sistema e Controle
  DATA_CADASTRO?: string | Date;
  DATA_RECAD?: string | Date;
  VENDEDOR: number;
  REDE_GRUPO: number;
  OBSERVACOES: string; // BLOB/TEXT mapeia como string
  ATIVO: 'S' | 'N';
  BLOQUEADO: 'S' | 'N';
  DIAS_BLOQUEIO: number;
  SITUACAO?: number;

  // Endereço de Cobrança (_C)
  ENDERECO_C: string;
  NUMERO_C: string;
  COMPLEMENTO_C: string;
  BAIRRO_C: string;
  CIDADE_C: string;
  ESTADO_C: string;
  PAIS_C: string;
  CEP_C: string;
  EMAIL_C: string;

  // Endereço de Entrega (_E)
  ENDERECO_E: string;
  NUMERO_E: string;
  COMPLEMENTO_E: string;
  BAIRRO_E: string;
  CIDADE_E: string;
  ESTADO_E: string;
  PAIS_E: string;
  CEP_E: string;
  EMAIL_E: string;

  // Dados Financeiros
  CREDITO: number;
  LIMITE_CREDITO: number;
  PRIMEIRA_COMPRA: string | Date;
  VALOR_PRIM_COMPRA: number;
  ULTIMA_COMPRA: string | Date;
  VALOR_ULT_COMPRA: number;
  FPAGAMENTO: number;
  TIPO_REC: number;
  DIA_VENC: number;
  CRED_LIBERADO: number;

  // Trabalho e Cônjuge
  LOCAL_TRABALHO: string;
  CARGO: string;
  SALARIO: number;
  ESTADO_CIVIL: string;
  SEXO: string;
  CONJUGE: string;
  CPF_CONJUGE: string;
  
  // Referências (Exemplo de algumas, a tabela vai até REF9)
  REF1: string;
  TEL1: string;
  REF2: string;
  TEL2: string;
  // ... adicione as demais conforme necessário

  // Outros Campos Específicos
  CONSUMIDOR_FINAL: 'S' | 'N';
  ATAC_VAREJO: 'A' | 'V';
  SUFRAMA: string;
  REGIME_TRIBUT: 'S' | 'SE' | 'N'; // Simples, Sublimite, Normal
  FRETE: 'S' | 'F' | 'C' | 'T' | 'R' | 'E';
  
  // Configurações de Site/Venda
  NO_SITE: 'N' | 'S';
  PERC_DESC: number;
  PERC_ACRESC: number;
  
  // Campos de Contato/Mídia
  MIDIA: '' | 'E' | 'N' | 'I' | 'J' | 'L' | 'O' | 'P' | 'R' | 'V' | 'T';
  INDICACAO?: string;
  
  // Log de Evento
  event?: string;
}