export interface ClassFiscal {
  CODIGO: number; // Primary Key
  NCM: string;    // Formato '0000.00.00'
  EX: string;     // Exceção da TIPI (00, 01...)
  DESCRICAO: string;
  
  // EFD Contribuições
  CODIGO_EFD?: number; 
  GERAR_EFD: 'N' | 'S'; // Gera contribuição previdenciária
  
  // Alíquotas IBPT (Transparência de Impostos)
  ALIQ_NAC: number; // Alíquota nacional
  ALIQ_IMP: number; // Alíquota importado
  
  // Controle e Versão
  TABELA: number;
  VERSAO: string;
  
  // CEST (Código Especificador da Substituição Tributária)
  COD_CEST?: string; // Formato '00.000.00'
  
  // Vigência
  VIGENCIA_INICIO?: string | Date;
  VIGENCIA_FIM?: string | Date;
}