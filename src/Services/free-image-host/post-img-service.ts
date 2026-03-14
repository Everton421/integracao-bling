import axios from 'axios';
import * as fs from 'fs/promises';
import path from "path";
import { constants } from 'fs';
import { ProdutoRepository } from '../../dataAcess/produto-repository/produto-repository';

type resultImg =  { link:string }
export class PostFreeImgHost {

 private   async fileExists(filePath: string) {
        try {
            await fs.access(filePath, constants.F_OK);
            return true; // The check succeeded
        } catch (error) {
            return false; // The check failed (file does not exist or other error)
        }
    }
  private  async postImgBaseCoverted(foto: string): Promise<string> {

        let key = process.env.API_KEY_FREEIMGHOST || '6d207e02198a847aa98d0a2a901485a5';

        let base64Clean = String(foto);

        const params = new URLSearchParams();
        params.append('key', key);
        params.append('source', base64Clean); // Envia a string limpa
        params.append('format', 'json');

        try {
            console.log("Iniciando upload para FreeImage.host...");

            const response = await axios.post('https://freeimage.host/api/1/upload', params);

            if (response.data && response.data.image && response.data.image.url) {
                console.log('Upload realizado com sucesso:', response.data.image.url);
                return response.data.image.url;
            } else {
                throw new Error("Retorno inesperado da API de Imagem");
            }

        } catch (error: any) {
            // Log detalhado do erro da API para facilitar debug
            console.error('Erro no upload FreeImage:', error.response?.data || error.message);
            throw new Error('Falha ao fazer upload da imagem: ' + (error.response?.data?.error?.message || error.message));
        }
    }


    private async postFreeImgHost(caminho: string, foto: string) {

            const imagePath = path.join(caminho, foto); // Caminho para a imagem
            if (await this.fileExists(imagePath)) {
                console.log('Arquivo encontrado caminho: ', imagePath)

                console.log(imagePath);

                const imageBase64 = await fs.readFile(imagePath, { encoding: 'base64' });

                try {
                  const url =  await this.postImgBaseCoverted(imageBase64)
                   return url;
                } catch (error: any) {
                    console.log(error);
                }

            } else {
                console.log( 'caminho nao encontrado | Caminho: ', imagePath);

                //  return;
            }


    }

     async postFoto( data:any ){
    
        const produto = new ProdutoRepository();
    
        const caminhoImg:any = await produto.buscaCaminhoFotos();
        const fotosProduto:any = await produto.buscaFotos(data.CODIGO);
        let links =[];
    
        if( fotosProduto.length > 0 ){
           
           for( const foto of fotosProduto ){
               try{
                
                const linkFoto =  await this.postFreeImgHost(caminhoImg[0].FOTOS, foto.FOTO.normalize('NFC') )
                if(linkFoto){
                 links.push({link: linkFoto} );
                }
    
            }catch(err){console.log(err+'erro ao enviar foto')}
               
            }
            return links as [{ link:string}];
        }else{
           console.log('nenhuma foto encontrada');
        }
    
    }
}