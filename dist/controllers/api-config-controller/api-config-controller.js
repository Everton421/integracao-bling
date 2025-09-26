"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiController = void 0;
const TokenMiddleware_1 = require("../../Middlewares/TokenMiddleware");
const databaseConfig_1 = require("../../database/databaseConfig");
const pedido_controller_1 = require("../pedido-controller/pedido-controller");
const api_config_repository_1 = require("../../dataAcess/api-config-repository/api-config-repository");
const sync_stock_1 = require("../../Services/sync-stock/sync-stock");
const sync_orders_1 = require("../../Services/sync-orders/sync-orders");
const sync_price_1 = require("../../Services/sync-price/sync-price");
var cron = require('node-cron');
class apiController {
    constructor() {
        this.pedido = new pedido_controller_1.pedidoController();
        this.syncStock = new sync_stock_1.SyncStock();
        this.syncOrders = new sync_orders_1.SyncORders();
        this.syncPrice = new sync_price_1.SyncPrice();
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async buscaConfig() {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.database_api}.config;`;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async ajusteConfig(req, res) {
        let obj = new api_config_repository_1.ApiConfigRepository();
        // console.log(req.body)
        let enviar_produtos = req.body.enviar_produtos;
        let tabela_preco = req.body.tabela_preco;
        let importar_pedidos = req.body.importar_pedidos;
        let codigo_vendedor = Number(req.body.codigo_vendedor);
        let enviar_estoque = req.body.enviar_estoque;
        let enviar_preco = req.body.enviar_precos;
        let setor = req.body.setor;
        let aux = await obj.atualizaDados({ enviar_precos: enviar_preco, enviar_estoque: enviar_estoque, enviar_produtos: enviar_produtos, tabela_preco: tabela_preco, vendedor: codigo_vendedor, importar_pedidos: importar_pedidos, setor: setor });
        if (aux.affectedRows > 0) {
            return res.redirect('/configuracoes');
        }
    }
    async main() {
        await (0, TokenMiddleware_1.verificaTokenTarefas)();
        if (!process.env.IMPORTAR_PEDIDOS) {
            throw new Error('é necessario informar a variavel process.env.IMPORTAR_PEDIDOS');
        }
        if (!process.env.ENVIAR_ESTOQUE) {
            throw new Error('é necessario informar a variavel process.env.ENVIAR_ESTOQUE');
        }
        if (!process.env.ENVIAR_PRECO) {
            throw new Error('é necessario informar a variavel process.env.PRECO');
        }
        const tempoPedido = process.env.IMPORTAR_PEDIDOS;
        const tempoEstoque = process.env.ENVIAR_ESTOQUE;
        const tempoPreco = process.env.ENVIAR_PRECO;
        let aux = [];
        try {
            aux = await this.buscaConfig();
        }
        catch (err) {
            console.log(err);
        }
        let config;
        if (aux.length > 0) {
            config = aux[0];
        }
        else {
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
            await this.delay(8000);
            let estoqueExecutando = false;
            cron.schedule(tempoEstoque, async () => {
                if (estoqueExecutando) {
                    console.log('Processo de envio de estoque já está em execução');
                    return;
                }
                estoqueExecutando = true;
                console.log('enviando estoque');
                try {
                    await this.syncStock.enviaEstoque();
                }
                catch (err) {
                    console.log('Erro ao enviar estoque:', err);
                }
                finally {
                    estoqueExecutando = false;
                }
            });
        }
        if (config.enviar_precos === 1) {
            await this.delay(8000);
            let precoExecutando = false;
            cron.schedule(tempoPreco, async () => {
                if (precoExecutando) {
                    console.log('Processo de envio de preço ja esta em execução');
                    return;
                }
                precoExecutando = true;
                console.log('enviando preço');
                try {
                    await this.syncPrice.enviaPrecos(Number(config.tabela_preco));
                }
                catch (e) {
                    console.log("Erro ao enviar o preco");
                }
                finally {
                    precoExecutando = false;
                }
            });
        }
    }
}
exports.apiController = apiController;
