import ConfigApi from "../api/api";
import { CategoriaApiRepository } from "../../dataAcess/api-categoria-repository/categoria-api-repository"; 
import { CategoriaRepository } from "../../dataAcess/categoria-repository/categoria-repository";

export class SyncCategory{

    private api:any = new ConfigApi();

    async validaCatedoria( value:any )   {

        await  this.api.configurarApi();

            const categoriaSistema = new CategoriaRepository();
            const categoriaAPI = new CategoriaApiRepository();
           
            let categoria:any= [];
             categoria = await categoriaAPI.buscaCategoriaApi(value);

                let id_bling = null;
                let codigo_sistema = null;
                let descricao = null;

                    if(categoria.length > 0 ){
                        console.log('categoria ja esta cadastrada')
                        id_bling = categoria[0].Id_bling;
                        return { msg:`categoria ${categoria[0].codigo_sistema} já foi enviada`};
                    }else{
                            const cadastroSistema:any = await  categoriaSistema.buscaGrupo(value);
                           // console.log(cadastroSistema)
                            if(cadastroSistema.length > 0 ){
                                
                                codigo_sistema = cadastroSistema[0].CODIGO; 
                                descricao = cadastroSistema[0].NOME
                                const data = {
                                "descricao": descricao,
                                "categoriaPai": {
                                  "id": 0
                                        }
                                    }
                                try{    
                                      const responseBling = await this.api.config.post('/categorias/produtos', data);
                                   // console.log(responseBling.data.data)
                                     id_bling = responseBling.data.data.id;
                                 //   console.log(id_bling)
                                     const value = { id_bling, codigo_sistema , descricao} ;
 
                                     const cadastro = await   categoriaAPI.cadastraCategoriaApi(value);
                                         if(responseBling.status === 201 ){
                                             return { msg:` categoria ${descricao} enviada com sucesso!` };
                                         }
                                         //return { msg:'categoria enviada com sucesso!'};

                                 }catch(err:any){
                                    if(err.response.status === 400 ){
                                             return { msg:` Falha ao tentar enviar categoria ${descricao}` };
                                         }
                                    console.log('erro ao enviar categoria '+ err)
                                
                                }
                            }else{
                                             return { msg:`categoria ${descricao} nao foi encontrada no sistema ` };

                            }

                    }

    }
}