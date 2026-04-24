import { AxiosError } from "axios";
import ConfigApi from "../api/api";


type naturezaOperacaoBling =  
  {
       id: number,
       situacao: number,
       padrao: number,
       descricao: string
    }

    type resultRequestWiretappingOperations =  
    {
        data :[
            {
            id: number,
            situacao: number,
            padrao: number,
            descricao: string
            }
     ]
    }

export class SyncNaturezaOperacao{
        private api = new ConfigApi();

  async getWiretappingOperations() {
                 
             await this.api.configurarApi();
 
                try{

                   const resultWiretappingOperations = await   this.api.config.get('/naturezas-operacoes') as resultRequestWiretappingOperations;
                   return resultWiretappingOperations;

                }catch(e){
                    if(e instanceof AxiosError){
                        console.log(`Erro ao tentar consultar as naturezas-operacoes no bling ` , e.response?.data);
                    }
                  return;
                }
             
        }
    

}