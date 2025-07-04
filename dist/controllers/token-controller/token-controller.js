"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenController = void 0;
const axios_1 = __importDefault(require("axios"));
const databaseConfig_1 = require("../../database/databaseConfig");
const api_token_repository_1 = require("../../dataAcess/api-token-repository/api-token-repository");
class TokenController {
    constructor() {
        this.objToken = new api_token_repository_1.ApiTokenRepository();
    }
    async obterToken(req, res, next) {
        const client_id = process.env.CLIENT_ID;
        const client_secret = process.env.CLIENT_SECRET;
        const urlBling = process.env.BASE_URL;
        const code = req.query.code;
        const base64Credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
        const headers = {
            'Host': 'www.bling.com.br',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '1.0',
            'Authorization': `Basic ${base64Credentials}`
        };
        const data = new URLSearchParams();
        data.append('grant_type', 'authorization_code');
        data.append('code', code);
        try {
            const apiToken = await axios_1.default.post(`${urlBling}/oauth/token`, data, { headers });
            // console.log(apiToken.data); // Se desejar, imprima a resposta
            console.log(apiToken.data);
            //res.status(200).json(apiToken.data); // Retorna a resposta como JSON
            if (apiToken.status === 200) {
                try {
                    let dadosinseridos = await this.objToken.insereToken(apiToken.data, databaseConfig_1.database_api);
                    res.redirect('/');
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao obter o token de API' }); // Retorna um erro 500 em caso de falha
        }
    }
}
exports.TokenController = TokenController;
