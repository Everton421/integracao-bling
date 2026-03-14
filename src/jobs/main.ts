import { pedidoController } from "../controllers/pedido-controller/pedido-controller";
import { ApiConfigRepository } from "../dataAcess/api-config-repository/api-config-repository";
import { IConfig } from "../interfaces/IConfig";
import { verificaTokenTarefas } from "../Middlewares/TokenMiddleware";
import { SyncORders } from "../Services/sync-orders/sync-orders";
import { SyncPrice } from "../Services/sync-price/sync-price";
import { SyncStock } from "../Services/sync-stock/sync-stock";
import { JobPrice } from "./job-price";
var cron = require('node-cron');

export  class Job{

     private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

          private pedido = new pedidoController();
                  private syncStock = new SyncStock();
                  private syncOrders = new SyncORders();
                  private syncPrice = new SyncPrice();
                    private apiConfigRepository = new ApiConfigRepository();
  async main() {
        await verificaTokenTarefas();

             if(!process.env.IMPORTAR_PEDIDOS){
                  throw new Error('é necessario informar a variavel process.env.IMPORTAR_PEDIDOS')  
               }
            if(!process.env.ENVIAR_ESTOQUE){
                  throw new Error('é necessario informar a variavel process.env.ENVIAR_ESTOQUE')  
               }
            if(!process.env.ENVIAR_PRECO){
                  throw new Error('é necessario informar a variavel process.env.PRECO')  
              } 

        const tempoPedido = process.env.IMPORTAR_PEDIDOS;
        const tempoEstoque = process.env.ENVIAR_ESTOQUE;
        const tempoPreco =  process.env.ENVIAR_PRECO;

        let aux:IConfig[] = [] ;

        try {
          aux = await this.apiConfigRepository.buscaConfig();
        } catch (err) {
          console.log(err);
        }
      
        let config:IConfig;
        if (aux.length > 0) {
          config  = aux[0];
        } else {
          return;
        }
      
        if (config.importar_pedidos === 1) {
          await this.delay(8000);
      
          cron.schedule(tempoPedido, async () => {
            await this.pedido.buscaPedidosBling(config.vendedor);
          await this.delay(2000);
            await this.syncOrders.updateBling();

          });
        }
      
        if (config.enviar_estoque === 1) {
          await  this.delay(8000);
          let estoqueExecutando = false;
      
          cron.schedule(tempoEstoque, async () => {
            if (estoqueExecutando) {
              console.log('[X] Processo de envio de estoque já está em execução');
              return;
            }
      
            estoqueExecutando = true;
            console.log('[V] Iniciando envio do estoque dos produtos.');
            try {
              await this.syncStock.enviaEstoque();
            } catch (err) {
            console.log('[X] Ocorreu um erro ao enviar estoque dos produtos.');

            } finally {
              estoqueExecutando = false;
            }
          });
        }
      
      if( config.enviar_precos === 1 ){
          await  this.delay(8000);
          let precoExecutando = false;

          cron.schedule(tempoPreco, async () => {
            console.log('[V] Iniciando envio dos preços dos produtos.');

            if(precoExecutando){
              console.log('[X] Processo de envio de preço ja esta em execução');
              return;
            }
               precoExecutando = true;
              try{
                const jobPrice  = new   JobPrice();
                        await jobPrice.enviaPrecos();
              }catch(e){
            console.log('[X] Ocorreu um erro ao enviar os preços dos produtos.');

              }finally{
               precoExecutando = false;
              }

          });

      }

    }
}