import { Request, Response } from "express";
import { SyncCategory } from "../../Services/sync-category/sync-category";

export class CategoriaController{


   async postCategory( req:Request, res:Response ){
   
    const syncCategory = new SyncCategory();

        const arrSelecionados = req.body.categorias
    if( Array.isArray(arrSelecionados) ){

        let arrResult=[]  
        for( const i of  arrSelecionados ){

                let result = await   syncCategory.validaCatedoria(Number(i));
                if( result && result.msg ){
                  arrResult.push(result.msg)
                } 

        }
        console.log(arrResult.toString())
       res.status(200).json( { msg:arrResult.toString()} )

    }

}    

}