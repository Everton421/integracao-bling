export type lojaBling = {
  data: {
    id: number,
    descricao: string,
    tipo: string,
    situacao: number,
    filiais: filial[]
  }
}

type filial = { 

             cnpj :string
             idUnidadeNegocio :number,
             unidadeNegocio : string,
             padrao :boolean
             deposito :{ id :number },


}