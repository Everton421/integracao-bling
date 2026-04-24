export interface CadForn {
  // --- Identificação Básica ---
  CODIGO: number; // Primary Key
  RAZAO_SOCIAL: string;
  NOME_FANTASIA: string;
  CNPJ: string; // Pode conter CPF se FIS_JUR for 'F'
  INSCRICAO: string; // Inscrição Estadual
  CMC: string; // Inscrição Municipal
  FIS_JUR: 'F' | 'J'; // F = Pessoa Física; J = Pessoa Jurídica
  
  // --- Fiscal e Tributário ---
  REGIME_TRIBUT: 'S' | 'SE' | 'N'; // S=Simples; SE=Sublimite; N=Normal
  CONTRIB: 'N' | 'S'; // Contribuinte de ICMS
  PARA_CONSUMO: 'N' | 'S';
  SUFRAMA: string;
  ATIV_EMPR: 'D' | 'I' | 'O' | 'M' | 'E' | 'F' | 'P' | 'R' | 'U'; 
  // Distribuidora, Indústria, ONG, Órgão Municipal, etc.

  // --- Endereço ---
  ENDERECO: string;
  NUMERO: string;
  COMPLEMENTO: string;
  BAIRRO: string;
  CIDADE: string;
  ESTADO: string;
  PAIS: string; // Default '1058' (Brasil)
  CEP: string;

  // --- Contato ---
  TELEFONE: string;
  FAX: string;
  TOLL_FREE: string;
  EMAIL: string;

  // --- Financeiro / Bancário ---
  CREDITO: number;
  CENTRO_CUSTO: number;
  BANCO: string;
  AGENCIA: string;
  CONTA: string;

  // --- Controle e Datas ---
  ATIVO: 'N' | 'S';
  DATA_CADASTRO: string | Date;
  DATA_RECAD?: string | Date;
  DATA_ULT_CONTATO?: string | Date;
  DATA_PROX_CONTATO?: string | Date;
  ATIVIDADE: number;
  
  // --- Observações ---
  OBSERVACOES: string;
  OBSERVACOES2: string;
  ENVIA_OBS1: 'S' | 'N';
  ENVIA_OBS2: 'S' | 'N';
}