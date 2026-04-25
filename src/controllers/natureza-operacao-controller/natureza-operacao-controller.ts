import { Request, Response } from "express";
import {  SyncWiretappingOperations } from "../../Services/sync-wire-tapping-operations/sync-wire-tapping-operations";

export class NaterezaOperacaoController{

    async getWiretappingOperations(req: Request, res: Response ){

        const syncWiretappingOperations = new SyncWiretappingOperations();
            
            const resultWireTappingOperations = await syncWiretappingOperations.getWiretappingOperations();

            if(resultWireTappingOperations && resultWireTappingOperations?.data.length > 0 ){
                
            }
    }
}