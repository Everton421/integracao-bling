import { ApiConfigRepository } from "../dataAcess/api-config-repository/api-config-repository";
import { ProdutoApiRepository } from "../dataAcess/api-produto-repository/produto-api-repository";
import { DateService } from "../Services/dateService/date-service";
import { SyncProduct } from "../Services/sync-products.ts/sync-product";

export class JobProduto{
    private syncProduct = new SyncProduct();
    private produtoApiRepository = new ProdutoApiRepository();
    private apiConfigRepository = new ApiConfigRepository();
    private dateService = new DateService();

      async enviarProdutos( ) {
        const data = this.dateService.obterDataHoraAtual();
         const [ config ] =  await this.apiConfigRepository.buscaConfig();

            if(!config.ult_env_produto){
                console.log("[X] Nenhum valor referente a data de ultimo envio de produto registrado no banco da integrção.")
                return
            }
                    const produtos = await this.produtoApiRepository.findChagedAfter(config.ult_env_produto!);

            let arrResult = []
            if(produtos.length > 0 ){
                console.log(`[V] enviando/atualizando ${produtos.length} produtos...`)
                    for (const i of produtos) {
                        let result: any = await this.syncProduct.postAndPutProd(Number(i.codigo_sistema), true );
                        if (result.resultados) {
                            arrResult.push(result.resultados)
                        }
                    }
            }
            await this.apiConfigRepository.atualizaDados({ ult_env_produto: data})
        }
    
}