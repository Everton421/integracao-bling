export interface MvtoProdutos {
  // --- Chaves e Identificação ---
  CHAVE_MVTO: number; // Relaciona com CODIGO da cad_nf ou cad_pedi
  ITEM: number;       // Sequencial do item (1, 2, 3...)
  TIPO: 'A' | 'B' | 'E' | 'F' | 'P' | 'PU' | 'PP' | 'PSD' | 'PST' | 'R' | 'PR'; 
  // A=Acerto; B=Balanço; E=Expedição; F=Faturamento; P=Produção; R=Requerimento...

  PRODUTO: number;    // Relaciona com CODIGO da cad_prod
  GRADE: number;
  PADRONIZADO: number;
  COMPLEMENTO?: string;

  // --- Quantidades e Unidades ---
  UNIDADE: string;    // ex: 'UND', 'KG', 'PC'
  ITEM_UNID: number;
  FATOR_VAL: number;
  FATOR_QTDE: number;
  QUANTIDADE: number;
  QTDE_SEPARADA: number;
  QTDE_EXPEDIDA: number;

  // --- Valores Financeiros ---
  VALOR_UNITARIO: number;
  VALOR_DESCONTO: number;
  TOTAL: number;      // Valor líquido (Unitário * Qtde - Desconto)
  CUSTO_ADIC: number;
  TEC: number;        // Taxa de Encargos
  PRECO_TABELA: number;
  CUSTO_MEDIO: number;
  ULT_CUSTO: number;
  COMP_MARGEM: number;
  LBV: number;        // Lucro Bruto Variável
  PESO_BRUTO: number;
  PESO_LIQUIDO: number;
  ORIGEM: string;

  // --- Impostos: IPI ---
  REGRA_IPI: number;
  CST_IPI: string;
  TIPO_TRIBUT_IPI: 'A' | 'V'; // A=Alíquota (%); V=Valor por Unidade
  ALIQ_VAL_IPI: number;
  FRETE_IPI: 'N' | 'S';
  JUST_IPI: string;   // TEXT

  // --- Impostos: ICMS / ST ---
  REGRA_ICMS: number;
  CST: string;        // CST do ICMS (ex: '090', '000')
  ALIQ_ICMS: number;
  REC_ICMS: number;
  INCI_ICMS: number;  // Incidência
  DIFER: number;      // Diferimento
  ALIQ_SUBST: number; // Alíquota ICMS ST
  MARG_SUBST: number; // MVA (%)
  APLIC_MVA: 'A' | 'B'; // A=Acréscimo; B=Própria Base
  PAUTA_SUBST: number;
  JUST_ICMS: string;  // TEXT
  JUST_SUBST: string; // TEXT

  // --- Impostos: PIS / COFINS ---
  REGRA_COFINS: number;
  CST_COFINS: string;
  ALIQ_COFINS: number;
  UNIT_COFINS: number;
  CST_PIS: string;
  ALIQ_PIS: number;
  UNIT_PIS: number;
  ALIQ_IRRF?: number;
  ALIQ_CSLL?: number;

  // --- Despesas Rateadas ---
  OUTRAS_DESP: number;
  FRETE: number;
  SEGURO: number;
  DESP_ADUAN: number;
  IOF: number;

  // --- Controle e Datas ---
  ENT_SAI: string;    // 'E' = Entrada, 'S' = Saída
  MOV_SALDO: 'S' | 'N';
  DATA_MVTO: string | Date;
  HORA_MVTO?: string; // HH:mm:ss
  CANCELADA: 'S' | 'N';
  STATUS?: 'A' | 'C' | 'D' | 'G' | 'P' | 'S' | 'E';
  SETOR: number;
  VEIO_PED: 'S' | 'N';
  
  // --- Regras e Promoções ---
  CFOP: string;
  REGRA_CFOP: number;
  PROM_ESPECIAL: 'S' | 'N';
  PROMO_PROD: 'S' | 'N';
  RETER_VALOR: 'S' | 'N'; // Deduzir PIS/COFINS/CSLL do total
  IPI_COFINS: 'S' | 'N';
  
  // --- Outros ---
  JUST_INCLUSAO_DIG?: string;
  ALIQ_FCPST: number; // Fundo de Combate à Pobreza ST
  TABELA: string;
  COD_TABELA: number;
}