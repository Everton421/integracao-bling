export interface CadNf {
  // --- Identificação Básica e Filial ---
  FILIAL: number;
  CODIGO: number; // Primary Key
  SERIE: number;
  SERIE_NF: string;
  NUMERO_NF: number;
  CHAVE_NFE: string;
  TRANSACAO: number;
  PEDIDO: number;
  CONTRATO: number;
  DEPART: number;
  USUARIO?: number;

  // --- Dados de NF-e (SEFAZ) ---
  DIGEST_VALUE_NFE: string;
  SIGNATURE_VALUE_NFE: string; // TEXT
  X509_CERTIFICATE_NFE: string; // TEXT
  EMISSAO_NFE: number; // Tipo de emissão
  AMBIENTE_NFE: 1 | 2; // 1 = Produção; 2 = Homologação
  LOTE_NFE: number;
  RECIBO_LOTE_NFE: string;
  PROTOCOLO_NFE: string;
  ULT_MOTIVO_NFE: string;
  SITUACAO_NFE: 'N' | 'T' | 'R' | 'P' | 'A' | 'D' | 'C'; // N=Não Transmitida, A=Autorizada, etc.
  CANCELADA: 'N' | 'S';
  DATA_HORA_CONTINGENCIA: string | Date;
  PL_NFE: number;
  FORM_DANFE: 1 | 2; // 1=Retrato; 2=Paisagem
  CHAVE_DPS?: string;

  // --- Cliente / Fornecedor ---
  CLI_FOR: string;
  CODIGO_CLI_FOR: number;
  ENDERECO_CLI_FOR: string;
  NUMERO_CLI_FOR: string;
  COMPLEMENTO_CLI_FOR: string;
  BAIRRO_CLI_FOR: string;
  CIDADE_CLI_FOR?: string;
  ESTADO_CLI_FOR: string;
  CEP_CLI_FOR: string;
  CPF_NFCE?: string;

  // --- Tributação e Valores (Financeiro) ---
  CFOP: string;
  CST_IPI_COMPL: string;
  CST_ICMS: string;
  FORMA_PAGAMENTO: number;
  VEND1: number;
  INDICE_FINANC: number;
  
  BASE_ICMS: number;
  VALOR_ICMS: number;
  BASE_ICMS_SUB: number;
  VALOR_ICMS_SUB: number;
  VALOR_ICMS_REC: number;
  
  TOTAL_PRODUTOS: number;
  TOTAL_SERVICOS: number;
  TOTAL_NF: number;
  
  VALOR_FRETE: number;
  VALOR_SEGURO: number;
  VALOR_OUTRAS_DESPESAS: number;
  DESC_PROD: number;
  DESC_SERV: number;
  DESC_FINANCEIRO?: number;
  
  // Impostos Retidos e Outros
  ISSQN: number;
  INSS: number;
  IRRF: number;
  PIS: number;
  COFINS: number;
  CSLL: number;
  RETIRRF: number;
  RETCSLL: number;
  RETPIS: number;
  RETCOFINS: number;
  
  // --- Logística e Transporte ---
  FRETE: 'S' | 'F' | 'C' | 'T' | 'R' | 'E'; // Sem frete, FOB, CIF, etc.
  TRANSPORTADORA: number;
  PLACA_VEICULO: string;
  ESTADO_VEICULO: string;
  RNTC_VEICULO: string;
  MARCA?: string;
  QUANTIDADE: number; // Volume
  ESPECIE: string;
  PESO_BRUTO: number;
  PESO_LIQUIDO: number;
  SIT_EXPED: 'N' | 'P' | 'I'; // Expedição
  SIT_SEPAR: 'N' | 'P' | 'I'; // Separação

  // --- Datas e Prazos ---
  DATA_EMISSAO: string | Date;
  DATA_SAIDA_ENTRADA: string | Date;
  HORA_SAIDA_ENTRADA: string; // HH:mm:ss
  COMPETENCIA: string; // "MM/AAAA"
  QTDE_PARCELAS: number;
  DIAS_PRIMEIRA: number;
  INTERVALO_PARCELAS: number;
  DATA_ENTREGA: string | Date;

  // --- Carta de Correção (CC-e) ---
  PROTOCOLO_CCE_NFE: number;
  DATA_CCE_NFE: string | Date;
  HORA_CCE_NFE: string;
  SEQ_CCE_NFE: number;
  MOTIVO_CCE_NFE?: string;

  // --- Outros / Controle Interno ---
  OBSERVACOES?: string; // BLOB
  OBSERVACOES2?: string; // BLOB
  DADOS_ADICIONAIS?: string; // BLOB
  DEVOLVIDA: 'N' | 'S';
  NF_DEVOLVIDA: number;
  IMPRESSO: 'N' | 'S';
  EXPORTADO: 'N' | 'S';
  PARA_CONSUMO: 'N' | 'S';
  OPERACAO?: 'I' | 'E' | 'X'; // Interna, Externa, eXportação
  
  // --- Novos Campos de Reforma Tributária (IBS/CBS) ---
  VBCIBSCBS?: number;
  VIBSUF?: number;
  VIBS?: number;
  VCBS?: number;
  
  // Campos de Texto/DADOS (DADOS1 a DADOS5)
  DADOS1: string;
  DADOS2: string;
  DADOS3: string;
  DADOS4: string;
  DADOS5: string;
}