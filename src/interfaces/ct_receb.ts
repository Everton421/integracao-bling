export interface CtReceb {
  // --- Chaves e Relacionamentos ---
  CODIGO: number;            // Primary Key
  CHAVE_MVTO: number;        // FK (Relaciona com CODIGO da cad_nf)
  FILIAL: number;
  CLIENTE: number;           // FK (Relaciona com cad_clie)
  VENDEDOR: number;          // FK (Relaciona com cad_vende/usuario)
  TRANSACAO: number;
  USUARIO?: number;

  // --- Documentação e Cobrança ---
  DOCUMENTO: string;         // Número da Nota ou Título
  NUM_BLOQUETO: string;      // Nosso Número / Boleto
  PARCELA: number;           // Número da parcela (1, 2, 3...)
  SERIE: number;
  DEPART: number;
  COMPETENCIA: string;       // Formato "MM/AAAA"
  HISTORICO: string;         // BLOB mapeado como string
  LINHA_DIGITAVEL?: string;  // Linha digitável do boleto
  COD_BARRAS?: string;
  NOSSO_NUM_CORRESP?: string; // UUID ou ID do banco correspondente

  // --- Valores Financeiros ---
  VALOR_ORIGINAL: number;    // Valor total da parcela sem juros/desconto
  VALOR: number;             // Valor atualizado
  VALOR_PAGO: number;        // Quanto já foi recebido
  DESCONTO: number;
  JUROS: number;
  ACRESCIMO: number;
  MULTA: number;

  // --- Datas ---
  VENCIMENTO_ORIGINAL: string | Date;
  VENCIMENTO: string | Date;
  DATA_PGTO: string | Date;
  DATA_LANCAMENTO: string | Date;
  DATA_DESCONTO: string | Date;
  INADIMPLENCIA: string | Date;
  CARTORIO: string | Date;
  CAUCAO: string | Date;
  DATA_PROX_CONTATO?: string | Date;
  DATA_ULT_CONTATO?: string | Date;

  // --- Status e Flags ---
  SITUACAO: string;          // Ex: 'A' (Aberto), 'Q' (Quitado)
  PROVISAO: 'N' | 'S';
  PARCIAL: string;           // 'N' | 'S'
  IMPRES_DUPLIC: 'N' | 'S';
  IMPRESSO: string;          // 'N' | 'S'
  EM_REMESSA: 'N' | 'S';
  TIPO_RECEBIMENTO: number;  // ID da forma de pagamento
  TIPO_EQUIFAX: '0' | '1' | '2';

  // --- Integração PIX ---
  QRCODE_PIX_EMV?: string;   // Copia e Cola
  QRCODE_PIX_TXID?: string;  // ID da transação PIX
  URL_PIX?: string;
  QRCODE_URL?: string;

  // --- Outros ---
  CENTRO_CUSTO: number;
  COD_CAIXA: number;
  OBS_PERDIDO: string;
}