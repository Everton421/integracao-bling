"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaController = void 0;
const sync_category_1 = require("../../Services/sync-category/sync-category");
class CategoriaController {
    async postCategory(req, res) {
        const syncCategory = new sync_category_1.SyncCategory();
        const arrSelecionados = req.body.categorias;
        if (Array.isArray(arrSelecionados)) {
            let arrResult = [];
            for (const i of arrSelecionados) {
                let result = await syncCategory.validaCatedoria(Number(i));
                if (result && result.msg) {
                    arrResult.push(result.msg);
                }
            }
            console.log(arrResult.toString());
            res.status(200).json({ msg: arrResult.toString() });
        }
    }
}
exports.CategoriaController = CategoriaController;
