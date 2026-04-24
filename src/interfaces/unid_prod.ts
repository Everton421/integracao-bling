export interface UnidProd {
  PRODUTO: number;      // FK da cad_prod (Código do Produto)
  ITEM: number;         // Sequencial da unidade para o produto
  DESCRICAO: string;    // ex: 'CAIXA COM 12', 'UNIDADE'
  SIGLA: string;        // ex: 'CX', 'UND', 'KG'
  FRACIONAVEL: 'N' | 'S'; 
  
  // Fatores de Conversão
  FATOR_VAL: number;    // Fator para cálculo de preço
  FATOR_QTDE: number;   // Fator para conversão de quantidade
  
  // Sinalizadores de Padrão
  PADR_ENT: 'N' | 'S';  // Padrão na Entrada (Compra)
  PADR_SAI: 'N' | 'S';  // Padrão na Saída (Venda)
  PADR_SEP: 'N' | 'S';  // Padrão na Separação/Expedição
  UND_TRIB: 'N' | 'S';  // Unidade Tributável (Fiscal)
}