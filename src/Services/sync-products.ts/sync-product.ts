import { IResponseErrorApi } from "../../interfaces/IResponseErrorApi";
import { IProdutoBlingSemPreco, ProdutoMapper } from "../../mappers/produto-mapper";
import { IProductSystem } from "../../interfaces/IProduct";
import { ProdutoRepository } from "../../dataAcess/produto-repository/produto-repository";
import { ProdutoApiRepository } from "../../dataAcess/api-produto-repository/produto-api-repository";
import ConfigApi from "../api/api";
import { DateService } from "../dateService/date-service";
import { SyncPrice } from "../sync-price/sync-price";
import { SyncStock } from "../sync-stock/sync-stock";
import { IConfig } from "../../interfaces/IConfig";

type dados = {
    codigo:number,
    data_recad_sistema:string
}

export class  SyncProduct{
         
         private   api = new ConfigApi();
         private dateService = new DateService();
         private  produtoApi = new ProdutoApiRepository();
         private produtoRepository = new ProdutoRepository();
         private syncStock = new SyncStock();
         private syncPrice = new SyncPrice();
         private produtoMapper = new ProdutoMapper();
         
         
        private delay(ms: number) {
         console.log(`Aguardando ${ms / 1000} segundos...`);
            return new Promise(resolve => setTimeout(resolve, ms));
       }  
 
  

    /**
     *  verifica se o produto existe no bling, consulta feita atravez do codigo do sistema, caso exista é feito o vinculo do produto
     * @param dados 
     * @returns 
     */     
    async getVinculoProduto(dados:  { codigo:number,data_recad_sistema:string }) {
        
        let produtoSemVinculo: any = [];
        let variacaoSemVinculo: any = [];
        let tipoVariacao = 'N'
        let comVariacao = 'N'
            let dadosProdutoBling:any[]=[]

            produtoSemVinculo = await this.api.config.get('/produtos', {
                params: {
                    pagina: 1,
                    limite: 100,
                    criterio: 2,
                   // tipo: 'P',
                    codigo: dados.codigo
                }
            })
            await this.delay(1000);
 
               if(produtoSemVinculo.data.data.length > 0){
                    dadosProdutoBling = produtoSemVinculo.data.data;
                    if( dadosProdutoBling[0].idProdutoPai && dadosProdutoBling[0].formato === 'S' ){
                        tipoVariacao = 'S'
                    }

                    if( !dadosProdutoBling[0].idProdutoPai && dadosProdutoBling[0].formato === 'V'){
                          comVariacao = 'S'
                    }
                }
                
//            console.log(produtoSemVinculo.data.data) 
        if (dadosProdutoBling.length > 0) {
            const produtoEnviado = {
                id_bling: dadosProdutoBling[0].id,
                codigo_sistema: dados.codigo,
                descricao: dadosProdutoBling[0].nome,
                saldo: 0,
                variacao: tipoVariacao,
                com_variacao: comVariacao,
                data_recad_sistema: this.dateService.formatarDataHora(dados.data_recad_sistema),
                data_estoque: this.dateService.obterDataHoraAtual(),
                data_envio: this.dateService.obterDataHoraAtual(),
                data_preco:'0000-00-00 00:00:00'
            }
            try {
                let prod: any = await this.produtoApi.inserir(produtoEnviado);
                 if (prod.affectedRows === 1) {
                     return { ok: true, erro:false, produto: produtoEnviado ,msg:   ` Registrado vinculo para o produto: ${ dados.codigo}     idBling: ${ dadosProdutoBling[0].id } `  }
                }
            } catch (error) {
                console.log(error)
                return { ok: false, erro: true, produto:null , msg:   ` Ocorreu um erro ao tentar registrar vinculo para o produto: ${ dados.codigo}     idBling: ${ dadosProdutoBling[0].id } `  }
            }
        } else {
             return { ok: false, erro: true, produto:null , msg:    `  Não foi encontrado produto: ${ dados.codigo} no bling `  }
        }
         
    }

 
 
    /**
     * envia o produto para o bling.
     * @param produtoBling dados do produto a ser enviado, dados estes que precisam ser tratados antes do envio
     * @param produtoSistema dados do produto vindos do banco de dados do sistema
     * @param enviEstoque parametro que informa se é necessario enviar o estoque ( 0: nao , 1:sim )
     * @returns 
     */
    async postProduto(produtoBling:IProdutoBlingSemPreco , produtoSistema:IProductSystem, enviEstoque:number){
        try {
        
                                    const response = await this.api.config.post('/produtos', produtoBling);
                                                     
                                           if(response.status ===200 || response.status ===201   ){
                                            let id_bling = response.data.data.id;
                                                let msgSucess =`produto ${produtoBling.codigo} enviado com sucesso `
                                                let prod =  await this.produtoApi.inserir(
                                                            {
                                                                codigo_sistema:produtoBling.codigo,
                                                                data_envio: this.dateService.obterDataHoraAtual(),
                                                                data_estoque: this.dateService.obterDataHoraAtual(),
                                                                data_recad_sistema:  this.dateService.formatarDataHora(produtoSistema.DATA_RECAD),
                                                                descricao:produtoBling.nome,
                                                                id_bling:response.data.data.id,
                                                                saldo:0,

                                                                variacao:'N',
                                                                com_variacao:'N',
                                                                data_preco: '2000-01-01 10:00:00'
                                                            }
                                                );
                                                        console.log(response.status, "produto enviado com sucesso!")
                                                        if( enviEstoque > 0 ){
                                                             console.log(response.status, "atuaizando saldo !")
                                                              await this.delay(1000);  
                                                            const arrEstoque = await this.produtoRepository.buscaEstoqueReal(produtoBling.codigo, 1 );
                                                            const estoque = arrEstoque[0].ESTOQUE    
                                                            const arrDeposito = await this.produtoApi.findDefaultDeposit();
                                                            const deposito = arrDeposito[0].Id_bling
                                                                await this.syncStock.postEstoque( id_bling, estoque,  deposito, produtoBling.codigo, this.dateService.obterDataHoraAtual() )
                                                                msgSucess = msgSucess + ` saldo: ${estoque} `
                                                            }
                                                
                                                            return   { status:response.status,  msg:  msgSucess } ;
                                                        
                                                    }   
                                } catch (err:IResponseErrorApi | any ) {
                                    console.log("Ocoreu um erro ao tentar cadastrar  o produto no bling ")
                                    console.log(produtoBling)
                                    return    {  status: err.response.status ,msg: err.response.data.error.description}  
                                }
    }

    /**
     * 
     * @param idProdutobling id do produto do bling 
     * @param produtoBling dados do produto a ser enviado, dados estes que precisam ser tratados antes do envio
     * @param enviEstoque parametro que informa se é necessario enviar o estoque ( 0: nao , 1:sim )
     * @param envPreco parametro que indica se é necessario enviar o preco do produto ( 0: nao , 1:sim )
     * @param tabela_preco tabela de preco para atualizar os precos
     * @returns 
     */
    async putProduto(idProdutobling:any, produtoBling:IProdutoBlingSemPreco, envEstoque:number, envPreco:number, tabela_preco:number, setor:number ){
       

              try {
                        const response = await this.api.config.put(`/produtos/${idProdutobling}`, produtoBling);

                        if (response.status === 200 || response.status === 201) {

                                            if( envEstoque > 0 ){
                                                     const arrEstoque = await this.produtoRepository.buscaEstoqueReal(produtoBling.codigo , setor );
                                                    const estoque = arrEstoque[0].ESTOQUE    
                                                    const arrDeposito = await this.produtoApi.findDefaultDeposit();
                                                    const deposito = arrDeposito[0].Id_bling
                                                        await this.syncStock.postEstoque( idProdutobling, estoque,  deposito, produtoBling.codigo, this.dateService.obterDataHoraAtual() )
                                                  }
                                              if( envPreco > 0 ){
                                                    await this.syncPrice.postPrice(idProdutobling, produtoBling.codigo, tabela_preco)
                                                  }

                            try {
                                let resultUpdate = await this.produtoApi.updateByParama({
                                    id_bling:  idProdutobling,
                                    data_envio: this.dateService.obterDataHoraAtual(),
                                    descricao: produtoBling.nome
                                });
                                if(  resultUpdate && resultUpdate.affectedRows > 0 ){
                                    return    {  status: response.status ,msg: `produto ${ produtoBling.nome} alterado com sucesso no bling`}  

                                }
                                

                            } catch (e: any) {
                                console.log("erro ao atualizar o produto no banco de dados da integração")
                                    return    {  status: e.response.status ,msg: e.response.data.error.description}  
                            }
                        } else {
                                    return    {  status: response ,msg: `Resposta inesperada (${response.status}) ao tentar atualizar o produto no Bling.`}  
                            }
                    } catch (err: IResponseErrorApi | any) {
                        const errorData = err.response?.data?.error.description;
                      console.log("Ocoreu um erro ao tentar atualizar  o produto no bling ")
                        console.log(err.response?.data?.error);
                      return    {  status: err.response.status ,msg: err.response.data.error.description}  
                    
                    }

    }

    /*
    async autoUpdateProduct(idProdutobling:any, produtoBling:IProdutoBlingSemPreco, config:IConfig ){
            
            const produtos = await this.produtoRepository.buscaProdutos();

                 if(produtos.length > 0 ){

                        for( const prod of produtos ){

                    const produtoBling = await this.produtoMapper.postProdutoMapper(prod, config.enviar_precos, config.tabela_preco );


                        }

                   }

                try {
                        const response = await this.api.config.put(`/produtos/${idProdutobling}`, produtoBling);

                        if (response.status === 200 || response.status === 201) {

                            try {
                                let resultUpdate = await this.produtoApi.updateByParama({
                                    id_bling:  idProdutobling,
                                    data_envio: this.dateService.obterDataHoraAtual(),
                                    descricao: produtoBling.nome
                                });
                                if(  resultUpdate && resultUpdate.affectedRows > 0 ){
                                    return    {  status: response.status ,msg: `produto ${ produtoBling.nome} alterado com sucesso no bling`}  

                                }
                                

                            } catch (e: any) {
                                console.log("erro ao atualizar o produto no banco de dados da integração")
                                    return    {  status: e.response.status ,msg: e.response.data.error.description}  
                            }
                        } else {
                                    return    {  status: response ,msg: `Resposta inesperada (${response.status}) ao tentar atualizar o produto no Bling.`}  
                            }
                    } catch (err: IResponseErrorApi | any) {
                        const errorData = err.response?.data?.error.description;
                      console.log("Ocoreu um erro ao tentar atualizar  o produto no bling ")
                        console.log(err.response?.data?.error);
                      return    {  status: err.response.status ,msg: err.response.data.error.description}  
                    
                    }
    }
    */

}