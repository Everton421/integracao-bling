import { AxiosError } from "axios";
import { BlingNotaFiscal } from "../../mappers/nf-mapper";
import ConfigApi from "../api/api";


export class SyncNf {
         private   api = new ConfigApi();

    async postNf( nfBling :BlingNotaFiscal){
        await this.api.configurarApi();

        try{

                  const response = await this.api.config.post('/nfe', nfBling);
                 console.log(response);
                

        }catch(e){
            let fieldsError 
            if(e instanceof AxiosError){
                fieldsError = e.response?.data.error.fields || e.response?.data.error.message;
        //    console.log(`[X] Erro ao tentar enviar a nota para o bling `, e.response.data)
            console.log(fieldsError);

            }
        }

    }
}