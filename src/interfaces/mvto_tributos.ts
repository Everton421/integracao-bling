export interface MvtoTributos {
  // --- Chaves e Identificação ---
  CHAVE_MVTO: number;     // FK (Relaciona com CODIGO da cad_nf)
  PROD_SERV: 'P' | 'S';   // P=Produto, S=Serviço
  ITEM: number;           // Sequencial do item na nota
  ENT_SAI: 'E' | 'S';     // Entrada ou Saída
  PRODUTO: number;        // Código do produto/serviço

  // --- Bases de Cálculo (BC) ---
  BASE_ICMS: number;
  BASE_IPI: number;
  BASE_SUBST: number;     // BC do ICMS ST
  BASE_SUBTR: number;     // BC da Redução ICMS
  BASE_PIS_COFINS: number;
  BASE_ISS: number;
  BASE_II: number;        // BC Imposto de Importação
  BASE_CSLL: number;
  BASE_ICMS_UF_DEST: number; // BC para o DIFAL

  // --- Valores de Impostos ---
  VALOR_IPI: number;
  VALOR_ICMS: number;
  VALOR_REC_ICMS: number; // ICMS recolhido anteriormente
  VALOR_DIFER: number;    // ICMS Diferido
  VALOR_SUBST: number;    // Valor do ICMS ST
  VALOR_MVA: number;      // Valor do MVA em Reais
  VALOR_SUBTR: number;    // Valor da Redução
  VALOR_PIS: number;
  VALOR_COFINS: number;
  VALOR_ISS: number;
  VALOR_CSLL: number;
  VALOR_II: number;
  VALOR_ST_SUBST: number;

  // --- Simples Nacional ---
  ALIQ_CREDICMS: number;  // % de crédito para Simples Nacional
  VALOR_CREDICMS: number; // Valor do crédito aproveitado

  // --- Partilha de ICMS (DIFAL) e FCP ---
  VALOR_ICMS_UF_ORIG: number;
  VALOR_ICMS_UF_DEST: number;
  VALOR_FCP_UF_DEST: number;
  VALOR_FCPST: number;

  // --- Desoneração e Benefícios ---
  VALOR_ICMS_DESON: number;
  CBENEF?: string;        // Código de Benefício Fiscal
  PCREDPRESUMIDO: number; // % Crédito Presumido
  VCREDPRESUMIDO: number; // Valor Crédito Presumido

  // --- ICMS Retido e Efetivo (Substituição Tributária) ---
  VBCSTRET: number;       // BC ICMS Retido anteriormente
  VICMSSTRET: number;     // Valor ICMS ST Retido anteriormente
  PST: number;            // Alíquota suportada pelo Consumidor Final
  VICMSSUBSTITUTO: number;
  PREDBCEFET: number;     // % Redução BC Efetiva
  VBCEFET: number;        // BC Efetiva
  PICMSEFET: number;      // % Alíquota ICMS Efetiva
  VICMSEFET: number;      // Valor ICMS Efetivo

  // --- Reforma Tributária (IBS / CBS) ---
  VBCIBSCBS?: number;     // Base de cálculo IBS e CBS
  VIBSUF?: number;        // Valor IBS UF
  VIBS?: number;          // Valor IBS Total
  VCBS?: number;          // Valor CBS Total

  // --- Outros ---
  DATA_ULT_CONTATO?: string | Date;
}