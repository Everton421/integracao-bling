// Enums e Tipos Literais para garantir consistência
  type TipoProduto = 'T' | 'P' | 'S' | 'E' | 'PS' | 'C' | 'V';
  type SituacaoProduto = 'A' | 'I' | 'E'; // Ativo, Inativo, Excluído
  type FormatoProduto = 'S' | 'V' | 'E'; // Simples, Com variação, Estrutura
  type TipoEstoque = 'F' | 'V' | 'D'; // Físico, Virtual, Direto
  type LancamentoEstoque = 'A' | 'M' | 'P'; // Automático, Manual, Por requisição

export interface Categoria {
  id: number;
}

export interface Estoque {
  minimo?: number;
  maximo?: number;
  crossdocking?: number;
  localizacao?: string;
  saldoVirtualTotal?: number;
}

export interface Fornecedor {
  id: number;
  contato: {
    id: number;
    nome: string;
  };
  codigo?: string;
  precoCusto?: number;
  precoCompra?: number;
}

export interface Dimensoes {
  largura: number;
  altura: number;
  profundidade: number;
  unidadeMedida: number;
}

export interface Tributacao {
  origem: number;
  nFCI?: string;
  ncm?: string;
  cest?: string;
  codigoListaServicos?: string;
  spedTipoItem?: string;
  codigoItem?: string;
  percentualTributos?: number;
  valorBaseStRetencao?: number;
  valorStRetencao?: number;
  valorICMSSubstituto?: number;
  codigoExcecaoTipi?: string;
  classeEnquadramentoIpi?: string;
  valorIpiFixo?: number;
  codigoSeloIpi?: string;
  valorPisFixo?: number;
  valorCofinsFixo?: number;
  codigoANP?: string;
  descricaoANP?: string;
  percentualGLP?: number;
  percentualGasNacional?: number;
  percentualGasImportado?: number;
  valorPartida?: number;
  tipoArmamento?: number;
  descricaoCompletaArmamento?: string;
  dadosAdicionais?: string;
  grupoProduto?: {
    id: number;
  };
}

export interface Midia {
  video?: {
    url: string;
  };
  imagens: {
    externas: Array<{ link: string }>;
    internas: Array<{
      link: string;
      linkMiniatura: string;
      validade: string;
      ordem: number;
      anexo: { id: number };
      anexoVinculo: { id: number };
    }>;
  };
}

export interface Estrutura {
  tipoEstoque: TipoEstoque;
  lancamentoEstoque: LancamentoEstoque;
  componentes: Array<{
    produto: { id: number };
    quantidade: number;
  }>;
}

export interface CampoCustomizado {
  idCampoCustomizado: number;
  idVinculo?: string;
  valor: string;
  item?: string;
}

// Interface que define os dados de uma variação (metadados)
export interface InfoVariacao {
  nome: string;
  ordem: number;
  produtoPai: {
    id: number;
    cloneInfo?: boolean;
  };
}

// Interface Base para evitar repetição entre Produto e Variação
interface BaseProduto {
  id: number;
  nome: string;
  codigo: string;
  preco: number;
  tipo: TipoProduto;
  situacao: SituacaoProduto;
  formato: FormatoProduto;
  descricaoCurta?: string;
  imagemURL?: string;
  dataValidade?: string;
  unidade?: string;
  pesoLiquido?: number;
  pesoBruto?: number;
  volumes?: number;
  itensPorCaixa?: number;
  gtin?: string;
  gtinEmbalagem?: string;
  tipoProducao?: 'P' | 'T';
  condicao?: number;
  freteGratis?: boolean;
  marca?: string;
  descricaoComplementar?: string;
  linkExterno?: string;
  observacoes?: string;
  descricaoEmbalagemDiscreta?: string;
  categoria?: Categoria;
  estoque?: Estoque;
  fornecedor?: Fornecedor;
  actionEstoque?: string;
  dimensoes?: Dimensoes;
  tributacao?: Tributacao;
  midia?: Midia;
  linhaProduto?: { id: number };
  estrutura?: Estrutura;
  camposCustomizados?: CampoCustomizado[];
  artigoPerigoso?: boolean;
}

// Variações possuem os mesmos campos do produto + o objeto variacao
export interface Variacao extends BaseProduto {
  variacao?: InfoVariacao;
}

// O Produto principal possui os campos base + o array de variações
export interface ProdutoBling {
  data: BaseProduto & {
    variacoes?: Variacao[];
  };
}