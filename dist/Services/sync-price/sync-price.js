"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPrice = void 0;
const produto_api_repository_1 = require("../../dataAcess/api-produto-repository/produto-api-repository");
const produto_repository_1 = require("../../dataAcess/produto-repository/produto-repository");
const api_1 = __importDefault(require("../api/api"));
const date_service_1 = require("../dateService/date-service");
const TokenMiddleware_1 = require("../../Middlewares/TokenMiddleware");
class SyncPrice {
    constructor() {
        this.api = new api_1.default();
        this.dateService = new date_service_1.DateService();
        this.produtoApi = new produto_api_repository_1.ProdutoApiRepository();
        this.produtoRepository = new produto_repository_1.ProdutoRepository();
    }
    delay(ms) {
        console.log(`Aguardando ${ms / 1000} segundos para enviar o preço...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     *
     * @param idProdutobling  id do produto no bling
     * @param preco preco a ser atualizado
     */
    async postPrice(idProdutobling, codigoProdutoSistema, tabela) {
        await this.api.configurarApi();
        const resultPrecoSistema = await this.produtoRepository.buscaPreco(codigoProdutoSistema, tabela);
        const resultPrecoEnviado = await this.produtoApi.findByIdBling(idProdutobling);
        if (resultPrecoSistema.length === 0) {
            return { ok: false, erro: true, msg: `nao foi encontrado preco do produto ${codigoProdutoSistema} na table ${tabela}` };
        }
        if (resultPrecoEnviado.length === 0) {
            return { ok: false, erro: true, msg: `nao foi encontrado registro do produto ${idProdutobling} nos produtos enviados ` };
        }
        const precoSistema = resultPrecoSistema[0];
        const precoEnviado = resultPrecoEnviado[0];
        if (new Date(precoSistema.DATA_RECAD) > new Date(precoEnviado.data_preco)) {
            let objPatch = {
                "preco": precoSistema.PRECO
            };
            try {
                const resultPrecoEnviado = await this.api.config.patch(`/produtos/${idProdutobling}`, objPatch);
                if (resultPrecoEnviado.status === 200 || resultPrecoEnviado.status === 201) {
                    await this.delay(1000);
                    await this.produtoApi.updateByParama({ id_bling: idProdutobling, data_preco: this.dateService.obterDataHoraAtual() });
                    return { ok: true, erro: false, msg: "preco atualizado com sucesso!" };
                }
            }
            catch (e) {
                console.log("Erro ao tentar atualizar preço do produto no bling ");
                console.log(e.response);
            }
        }
    }
    async enviaPrecos(tabela) {
        await (0, TokenMiddleware_1.verificaTokenTarefas)();
        await this.api.configurarApi();
        try {
            const produtosEnviados = await this.produtoApi.buscaSincronizados();
            if (produtosEnviados.length > 0) {
                for (const data of produtosEnviados) {
                    const resultPrecoSistema = await this.produtoRepository.buscaPreco(data.codigo_sistema, tabela);
                    if (resultPrecoSistema.length > 0) {
                        const precoProduto = resultPrecoSistema[0];
                        if (new Date(precoProduto.DATA_RECAD) > new Date(data.data_preco)) {
                            let objPatch = {
                                "preco": precoProduto.PRECO
                            };
                            try {
                                const resultPrecoEnviado = await this.api.config.patch(`/produtos/${data.Id_bling}`, objPatch);
                                if (resultPrecoEnviado.status === 200 || resultPrecoEnviado.status === 201) {
                                    await this.delay(1000);
                                    await this.produtoApi.updateByParama({ id_bling: data.Id_bling, data_preco: this.dateService.obterDataHoraAtual() });
                                    //  return { ok: true, erro: false, msg: "preco atualizado com sucesso!" }
                                    console.log("preco atualizado com sucesso!");
                                }
                            }
                            catch (e) {
                                console.log("Erro ao tentar atualizar preço do produto no bling ");
                                console.log(e.response);
                            }
                        }
                        else {
                            console.log(precoProduto.DATA_RECAD, " > ", data.data_preco);
                            console.log(`Não ouve mudança no preço do produto ${data.descricao} na tabela ${tabela} `);
                        }
                    }
                    else {
                        console.log(`Não foi encontrado registro de preço do produto ${data.descricao} na tabela ${tabela} `);
                    }
                }
            }
        }
        catch (e) {
        }
    }
}
exports.SyncPrice = SyncPrice;
