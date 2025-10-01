"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncProduct = void 0;
const produto_mapper_1 = require("../../mappers/produto-mapper");
const produto_repository_1 = require("../../dataAcess/produto-repository/produto-repository");
const produto_api_repository_1 = require("../../dataAcess/api-produto-repository/produto-api-repository");
const api_1 = __importDefault(require("../api/api"));
const date_service_1 = require("../dateService/date-service");
const sync_price_1 = require("../sync-price/sync-price");
const sync_stock_1 = require("../sync-stock/sync-stock");
const api_config_repository_1 = require("../../dataAcess/api-config-repository/api-config-repository");
const categoria_api_repository_1 = require("../../dataAcess/api-categoria-repository/categoria-api-repository");
class SyncProduct {
    constructor() {
        this.api = new api_1.default();
        this.dateService = new date_service_1.DateService();
        this.produtoApi = new produto_api_repository_1.ProdutoApiRepository();
        this.produtoRepository = new produto_repository_1.ProdutoRepository();
        this.syncStock = new sync_stock_1.SyncStock();
        this.syncPrice = new sync_price_1.SyncPrice();
        this.produtoMapper = new produto_mapper_1.ProdutoMapper();
        this.produto = new produto_repository_1.ProdutoRepository();
        this.categoriaRepository = new categoria_api_repository_1.CategoriaApiRepository();
    }
    delay(ms) {
        console.log(`Aguardando ${ms / 1000} segundos...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     *  verifica se o produto existe no bling, consulta feita atravez do codigo do sistema, caso exista é feito o vinculo do produto
     * @param dados
     * @returns
     */
    async getVinculoProduto(dados) {
        let produtoSemVinculo = [];
        let variacaoSemVinculo = [];
        let tipoVariacao = 'N';
        let comVariacao = 'N';
        let dadosProdutoBling = [];
        produtoSemVinculo = await this.api.config.get('/produtos', {
            params: {
                pagina: 1,
                limite: 100,
                criterio: 2,
                // tipo: 'P',
                codigo: dados.codigo
            }
        });
        await this.delay(1000);
        if (produtoSemVinculo.data.data.length > 0) {
            dadosProdutoBling = produtoSemVinculo.data.data;
            if (dadosProdutoBling[0].idProdutoPai && dadosProdutoBling[0].formato === 'S') {
                tipoVariacao = 'S';
            }
            if (!dadosProdutoBling[0].idProdutoPai && dadosProdutoBling[0].formato === 'V') {
                comVariacao = 'S';
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
                data_preco: '2001-01-01 10:00:00'
            };
            try {
                let prod = await this.produtoApi.inserir(produtoEnviado);
                if (prod.affectedRows === 1) {
                    return { ok: true, erro: false, produto: produtoEnviado, msg: ` Registrado vinculo para o produto: ${dados.codigo}     idBling: ${dadosProdutoBling[0].id} ` };
                }
            }
            catch (error) {
                console.log(error);
                return { ok: false, erro: true, produto: null, msg: ` Ocorreu um erro ao tentar registrar vinculo para o produto: ${dados.codigo}     idBling: ${dadosProdutoBling[0].id} ` };
            }
        }
        else {
            return { ok: false, erro: true, produto: null, msg: `  Não foi encontrado produto: ${dados.codigo} no bling ` };
        }
    }
    /**
     * envia o produto para o bling.
     * @param produtoBling dados do produto a ser enviado, dados estes que precisam ser tratados antes do envio
     * @param produtoSistema dados do produto vindos do banco de dados do sistema
     * @param enviEstoque parametro que informa se é necessario enviar o estoque ( 0: nao , 1:sim )
     * @returns
     */
    async postProduto(produtoBling, produtoSistema, enviEstoque) {
        try {
            const response = await this.api.config.post('/produtos', produtoBling);
            if (response.status === 200 || response.status === 201) {
                let id_bling = response.data.data.id;
                let msgSucess = ` produto ${produtoBling.codigo} enviado com sucesso  `;
                let prod = await this.produtoApi.inserir({
                    codigo_sistema: produtoBling.codigo,
                    data_envio: this.dateService.obterDataHoraAtual(),
                    data_estoque: this.dateService.obterDataHoraAtual(),
                    data_recad_sistema: this.dateService.formatarDataHora(produtoSistema.DATA_RECAD),
                    descricao: produtoBling.nome,
                    id_bling: response.data.data.id,
                    saldo: 0,
                    variacao: 'N',
                    com_variacao: 'N',
                    data_preco: '2000-01-01 10:00:00'
                });
                console.log(response.status, "produto enviado com sucesso!");
                if (enviEstoque > 0) {
                    console.log(response.status, "atuaizando saldo !");
                    await this.delay(1000);
                    const arrEstoque = await this.produtoRepository.buscaEstoqueReal(produtoBling.codigo, 1);
                    const estoque = arrEstoque[0].ESTOQUE;
                    const arrDeposito = await this.produtoApi.findDefaultDeposit();
                    const deposito = arrDeposito[0].Id_bling;
                    await this.syncStock.postEstoque(id_bling, estoque, deposito, produtoBling.codigo, this.dateService.obterDataHoraAtual());
                    msgSucess = msgSucess + ` saldo: ${estoque} `;
                }
                return { status: response.status, msg: msgSucess };
            }
        }
        catch (err) {
            console.log("Ocoreu um erro ao tentar cadastrar  o produto no bling ");
            console.log(produtoBling);
            return { status: err.response.status, msg: err.response.data.error.description };
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
    async putProduto(idProdutobling, produtoBling, envEstoque, envPreco, tabela_preco, setor) {
        try {
            const response = await this.api.config.put(`/produtos/${idProdutobling}`, produtoBling);
            if (response.status === 200 || response.status === 201) {
                if (envEstoque > 0) {
                    const arrEstoque = await this.produtoRepository.buscaEstoqueReal(produtoBling.codigo, setor);
                    const estoque = arrEstoque[0].ESTOQUE;
                    const arrDeposito = await this.produtoApi.findDefaultDeposit();
                    const deposito = arrDeposito[0].Id_bling;
                    await this.syncStock.postEstoque(idProdutobling, estoque, deposito, produtoBling.codigo, this.dateService.obterDataHoraAtual());
                }
                if (envPreco > 0) {
                    await this.syncPrice.postPrice(idProdutobling, produtoBling.codigo, tabela_preco);
                }
                try {
                    let resultUpdate = await this.produtoApi.updateByParama({
                        id_bling: idProdutobling,
                        data_envio: this.dateService.obterDataHoraAtual(),
                        descricao: produtoBling.nome
                    });
                    if (resultUpdate && resultUpdate.affectedRows > 0) {
                        return { status: response.status, msg: ` produto ${produtoBling.nome} alterado com sucesso no bling ` };
                    }
                }
                catch (e) {
                    console.log("erro ao atualizar o produto no banco de dados da integração");
                    return { status: e.response.status, msg: e.response.data.error.description };
                }
            }
            else {
                return { status: response, msg: ` Resposta inesperada (${response.status}) ao tentar atualizar o produto no Bling. ` };
            }
        }
        catch (err) {
            const errorData = err.response?.data?.error.description;
            console.log("Ocoreu um erro ao tentar atualizar  o produto no bling ");
            console.log(err.response?.data?.error);
            return { status: err.response.status, msg: err.response.data.error.description };
        }
    }
    async postAndPutProd(codigoStr, validDateUpdate) {
        const resultadosIntegracao = [];
        // configurações para envio das informações
        let objConfig = new api_config_repository_1.ApiConfigRepository();
        let dadosConfig = await objConfig.buscaConfig();
        // contem o valor do parametro de envio de estoque ( 0: nao enviar estoque, 1: enviar o estoque) 
        const envEstoque = Number(dadosConfig[0].enviar_estoque);
        // contem o valor do parametro de envio de preco ( 0: nao enviar preco, 1: enviar o preco) 
        const envPreco = Number(dadosConfig[0].enviar_precos);
        // tabela onde é feita a consulta dos precos a serem enviados
        const tabela_preco = Number(dadosConfig[0].tabela_preco);
        // setor onde será buscado o saldo de estoque 
        const setor = dadosConfig[0].setor;
        let resultadoOperacao = { codigo: codigoStr, success: false, msg: "Operação não concluída." };
        try {
            const codigoSelecionado = Number(codigoStr);
            console.log(`Processando envio/atualização do produto código: ${codigoSelecionado}`);
            //  tenta buscar o produto selecionado pelo usuario na tabela da integração. 
            const arrProdutoSincronizado = await this.produtoApi.findByCodeSystem(codigoSelecionado);
            // busca o item no banco de dados do sistema
            const arrProdSelected = await this.produto.buscaProduto(codigoSelecionado);
            if (!arrProdSelected || arrProdSelected.length === 0) {
                resultadoOperacao = { codigo: codigoSelecionado, success: false, msg: `Produto ${codigoSelecionado} não encontrado no sistema de origem.` };
                console.log(resultadoOperacao.msg);
                resultadosIntegracao.push(resultadoOperacao.msg);
                return resultadosIntegracao;
            }
            // extrai o produto do array 
            const prodSelected = arrProdSelected[0];
            // verifica a categoria do produto
            const arrCategoria = await this.categoriaRepository.buscaCategoriaApi(prodSelected.GRUPO);
            if (!arrCategoria || arrCategoria.length === 0) {
                resultadoOperacao = { codigo: codigoSelecionado, success: false, msg: `Categoria código: ${prodSelected.GRUPO}  do produto  ${codigoSelecionado}  ainda não foi enviada para o Bling.   ` };
                console.log(resultadoOperacao.msg);
                resultadosIntegracao.push(resultadoOperacao.msg);
                return resultadosIntegracao;
            }
            // processa o produto retornando os dados do produto de acordo com o que a api do bling esta esperando.
            const produtoBling = await this.produtoMapper.postProdutoMapper(prodSelected, envPreco, tabela_preco);
            await this.delay(1000);
            // se o produto selecionado for encontrado, faz a atualização.
            if (arrProdutoSincronizado.length > 0) {
                const produtoSincronizado = arrProdutoSincronizado[0];
                console.log(`Produto ${codigoSelecionado} já existe no Bling (ID: ${produtoSincronizado.Id_bling}). Atualizando...`);
                /// verifica o parametro de validDateUpdate da função, onde é determinado 
                //  se será necessario fazer a comparação das data de recadastro dos produtos 
                if (validDateUpdate) {
                    if (new Date(prodSelected.DATA_RECAD) > new Date(produtoSincronizado.data_envio)) {
                        await this.delay(1000);
                        const responsePutProduto = await this.putProduto(produtoSincronizado.Id_bling, produtoBling, envEstoque, envPreco, tabela_preco, setor);
                        resultadoOperacao = { codigo: codigoSelecionado, ...responsePutProduto };
                    }
                    else {
                        resultadoOperacao = { codigo: codigoStr, success: false,
                            msg: `O produto ${prodSelected.DESCRICAO} se encontra atualizado` };
                        console.log(`O produto ${prodSelected.DESCRICAO} se encontra atualizado`);
                    }
                }
                else {
                    await this.delay(1000);
                    const responsePutProduto = await this.putProduto(produtoSincronizado.Id_bling, produtoBling, envEstoque, envPreco, tabela_preco, setor);
                    resultadoOperacao = { codigo: codigoSelecionado, ...responsePutProduto };
                }
            }
            else {
                // produto nao foi enviado, será feito o envio    
                console.log(`Produto ${codigoSelecionado} não encontrado no Bling. Enviando como novo...`);
                await this.delay(1000);
                const responsePostProduto = await this.postProduto(produtoBling, prodSelected, envEstoque);
                resultadoOperacao = { codigo: codigoSelecionado, ...responsePostProduto };
                console.log(`Resultado do envio do novo produto ${codigoSelecionado}: ${JSON.stringify(resultadoOperacao)}`);
            }
            resultadosIntegracao.push(resultadoOperacao.msg);
        }
        catch (error) {
            console.error(`Erro crítico ao processar produto ${codigoStr} em enviaProduto:`, error);
            resultadoOperacao = { codigo: codigoStr, success: false, msg: `Erro interno crítico ao processar produto ${codigoStr}: ${error.message || error}` };
            resultadosIntegracao.push(resultadoOperacao.msg);
        }
        return { resultados: resultadosIntegracao.toString() };
    }
}
exports.SyncProduct = SyncProduct;
