"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetorRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class SetorRepository {
    async buscaSetor() {
        return new Promise(async (resolve, reject) => {
            let sql = ` 
                            SELECT * FROM ${databaseConfig_1.db_estoque}.setores WHERE ATIVO = 'S';
                            `;
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
}
exports.SetorRepository = SetorRepository;
