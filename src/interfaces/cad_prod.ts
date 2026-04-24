export interface CadProd {
  // --- Identificação e Descrições ---
  CODIGO: number; // Primary Key
  GRADE: number;
  GRUPO: number;
  SUBGRUPO: number;
  DESCRICAO: string;
  DESCR_REDUZ: string;
  DESCR_REDUZ_OLD?: string;
  CARAC_DESCR: 'C' | 'I' | 'N'; // C=Inclusão; I=Impressão; N=Não incluir
  DESCR_CURTA?: string; // TEXT
  DESCR_LONGA?: string; // TEXT
  MSG_PRODUTO?: string;

  // --- Códigos e Referências ---
  NUM_FABRICANTE?: string;
  NUM_ORIGINAL?: string;
  OUTRO_COD?: string;
  OUTRO_COD2?: string;
  NUM_FCI?: string;
  SKU_MKTPLACE?: string;
  SKU_SITE?: string;
  PPB?: string;

  // --- Classificação e Atributos ---
  MARCA: number;
  TIPO: number;
  ATIVO: 'S' | 'N';
  NIVEL?: string;
  USAR_DESC: 'N' | 'S' | 'B'; // N=Não; S=Sim; B=Bloqueado
  MOV_SALDO: 'S' | 'N';
  CONTR_LOTE_SERIE: 'S' | 'N';
  VOLTAGEM: 0 | 1 | 2 | 3; // 0=Sem V; 1=110V; 2=220V; 3=Bivolt
  GARANTIA: number;

  // --- Fiscal ---
  CST: string;
  CLASS_FISCAL: number; // NCM
  ORIGEM: string; // Geralmente '0' a '8'
  BNDES: 'S' | 'N';

  // --- Custos e Preços ---
  ULT_CUSTO1: number;
  CUSTO_MEDIO1: number;
  VAL_INCLUSAO_DIG: number;
  JUST_INCLUSAO_DIG: string;
  INDEXADO1: 'S' | 'N';
  BLOQ_RECALC: 'S' | 'N';

  // --- Estoque e Logística ---
  ESTOQUE_MIN: number;
  LOCAL_PRODUTO?: string;
  LOCAL1_PRODUTO?: string;
  LOCAL2_PRODUTO?: string;
  LOCAL3_PRODUTO?: string;
  LOCAL4_PRODUTO?: string;
  PESO: number;
  COMPRIMENTO: number; // Embalagem
  LARGURA: number; // Embalagem
  ALTURA: number; // Embalagem
  QTDE_VOL: number;

  // --- Medidas e Porções ---
  PORCAO: number;
  UND_PORCAO: '0' | '1' | '2'; // 0=g; 1=ml; 2=un
  MED_INT: number;
  MED_DEC: '0' | '1' | '2' | '3' | '4' | '5'; // Frações (1/4, 1/2, etc)
  MED_UTIL: string; // Enum de códigos de colher, xícara, etc.

  // --- E-commerce e Marketplace (Site) ---
  NO_SITE: 'S' | 'N';
  IMPORTADO_SITE: 'S' | 'N';
  ALTERADO_SITE: 'S' | 'N';
  DESTAQUE_SITE: 'S' | 'N';
  TITULO_SITE?: string;
  APLIC_SITE?: string;
  APLICACAO_SITE?: string;
  DESCR_CURTA_SITE?: string;
  DESCR_LONGA_SITE?: string;
  REMOCAO_SITE?: string | Date;
  SITE_DESBLOQUEAR_PRECO: 'S' | 'N';

  // --- Marketplace Específico ---
  NO_MKTP: 'S' | 'N';
  TITULO_MKTPLACE?: string;
  DESCR_CURTA_MKTPLACE?: string;
  DESCR_LONGA_MKTPLACE?: string;
  APLICACAO_MKTPLACE?: string;
  CATEGORIA_MKTPLACE?: string;
  INTERM_CATEGORIA_MKTPLACE?: string;
  FINALCATEGORIA_MKTPLACE?: string;
  
  // --- Integração AnyMarket ---
  NO_ANYMARKET: 'S' | 'N';
  COD_ANYMARKET?: number;

  // --- Datas e Auditoria ---
  DATA_CADASTRO: string | Date;
  DATA_RECAD?: string | Date;
  DATA_LANCAMENTO: string | Date;
  PRIM_COMPRA1: string | Date;
  ULT_COMPRA1?: string | Date;
  ULT_RECALC1?: string | Date;
  INICIO_PROM?: string | Date;

  // --- Outros ---
  APLICACAO?: string; // BLOB
  OBSERVACOES1?: string; // TEXT
  OBSERVACOES2?: string; // TEXT
  OBSERVACOES3?: string; // TEXT
  ULT_FORNECEDOR1: number;
  ULT_FATUR1: number;
  LIMITE_OFERTA_NET: number;
}