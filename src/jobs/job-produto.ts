import { ProdutoRepository } from "../dataAcess/produto-repository/produto-repository";
import { SyncProduct } from "../Services/sync-products.ts/sync-product";

export class JobProduto{
    private syncProduct = new SyncProduct();
    private produtoRepository = new ProdutoRepository();

      async enviarProdutos( ) {

                    const produtos = await this.produtoRepository.buscaProdutos();
            let arrResult = []
            for (const i of produtos) {
                let result: any = await this.syncProduct.postAndPutProd(Number(i.CODIGO), true );
                if (result.resultados) {
                    arrResult.push(result.resultados)
                }
    
            }
    
        }
    
}