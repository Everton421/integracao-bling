import { conn,    db_estoque, db_publico, db_vendas } from "../../database/databaseConfig" ;
import { IProductSystem } from "../../interfaces/IProduct";

type prodPreco = {
  PRECO:number, PRODUTO:number, TABELA:number, DATA_RECAD:string  
}

export class ProdutoRepository{

    async buscaProdutos():Promise<IProductSystem[]>{

        return new Promise( async (resolve, reject)=>{
          
            let sql = ` 
                            SELECT * FROM ${db_publico}.cad_prod WHERE NO_SITE = 'S';
                            `;
            await conn.query(sql, (err:any,result:any)=>{
              if(err){
                reject(err);
              }else{
                resolve(result);
              }
            });
        });
  
     }

     async buscaProduto(codigo:number):Promise<IProductSystem[]>{
      return new Promise( async (resolve, reject)=>{
          let sql = `SELECT * FROM ${db_publico}.cad_prod WHERE NO_SITE = 'S' AND CODIGO = ${codigo};`;
          await conn.query(sql, async (err:any,result:IProductSystem[])=>{
            if(err){
              return reject(err);
            }else{
//              resolve(result);
              resolve(result)
            }
          });
      });
 
   }
    async buscaEstoqueReal(codigo:number, setor:number ):Promise<[{CODIGO:number, ESTOQUE:number, DATA_RECAD:string }]>{
      return new Promise( async (resolve, reject)=>{
                            
      const sql = `
                  SELECT  
                        est.CODIGO,
                        IF(est.estoque < 0, 0, est.estoque) AS ESTOQUE,
                        est.DATA_RECAD
                      FROM 
                        (SELECT
                          P.CODIGO,
                          PS.DATA_RECAD,
                          (SUM(PS.ESTOQUE) - 
                            (SELECT COALESCE(SUM((IF(PO.QTDE_SEPARADA > (PO.QUANTIDADE - PO.QTDE_MOV), PO.QTDE_SEPARADA, (PO.QUANTIDADE - PO.QTDE_MOV)) * PO.FATOR_QTDE) * IF(CO.TIPO = '5', -1, 1)), 0)
                              FROM ${db_vendas}.cad_orca AS CO
                              LEFT OUTER JOIN ${db_vendas}.pro_orca AS PO ON PO.ORCAMENTO = CO.CODIGO
                              WHERE CO.SITUACAO IN ('AI', 'AP', 'FP')
                              AND PO.PRODUTO = P.CODIGO)) AS estoque
                        FROM ${db_estoque}.prod_setor AS PS
                        LEFT JOIN ${db_publico}.cad_prod AS P ON P.CODIGO = PS.PRODUTO
                        INNER JOIN ${db_publico}.cad_pgru AS G ON P.GRUPO = G.CODIGO
                        LEFT JOIN ${db_estoque}.setores AS S ON PS.SETOR = S.CODIGO
                        WHERE P.CODIGO = ${codigo}
                        AND PS.SETOR = ${setor}
                        GROUP BY P.CODIGO) AS est;
                  `

    await conn.query( sql ,(err:any , result:any)=>{
        if(err){
          reject(err)
          console.log('erro ao obter o saldo de estoque')
        }else{
            resolve(result);
        }
      })
      })
    }


    async buscaTabelaDePreco( ):Promise<[ { CODIGO:number, FILIAL:number, DESCRICAO:String, PADRAO: 'S'| 'N'} ]>{
      return new Promise( async (resolve, reject)=>{
        
      const sql=` SELECT * FROM ${db_publico}.tab_precos ORDER BY CODIGO DESC ;
                          `
      await conn.query( sql ,(err:any , result:any)=>{
        if(err){
          reject(err)
          console.log('erro ao obter o tabela de preco')
        }else{
            resolve(result);
        }
      })
      })
    }


  async buscaPreco( produto:any, tabela:any ):Promise<prodPreco[]>{
    const sql =  ` SELECT pp.PRECO, pp.PRODUTO, pp.TABELA, pp.DATA_RECAD   from ${db_publico}.prod_tabprecos pp
                  join ${db_publico}.tab_precos tp on tp.codigo = pp.tabela 
                  where pp.PRODUTO = ${produto} and tp.CODIGO = ${tabela}   
                ; ` 
    return new Promise( async ( resolve, reject )=>{
      await conn.query(sql, ( err, result )=>{
          if(err){
            reject(err);
          }else{
            resolve(result);
          }
      })
    })
  }

  async buscaFotos(produto:any){
    const sql =  `  
        SELECT  CAST(FOTO  AS CHAR(1000)  CHARACTER SET utf8)  FOTO  from ${db_publico}.fotos_prod where  PRODUTO = ${produto};    
                ; ` 

    return new Promise( async ( resolve, reject )=>{
      await conn.query(sql, ( err, result )=>{
          if(err){
            reject(err);
          }else{
            resolve(result);
          }
      })
    })

  }

    async buscaCaminhoFotos(){
      const sql =  `  
      SELECT  CAST(FOTOS AS CHAR(1000)  CHARACTER SET utf8)  FOTOS from ${db_vendas}.parametros;   
                ; ` 

    return new Promise( async ( resolve, reject )=>{
      await conn.query(sql, ( err, result )=>{
          if(err){
            reject(err);
          }else{
            resolve(result);
          }
      })
    })

  }

    async buscaNcm( codigo:any):Promise< [ { CODIGO:number, NCM:string, COD_CEST: string } ] >{
    return new Promise( async (resolve, reject)=>{
        const sql = `SELECT CODIGO  , NCM  , COD_CEST   FROM ${db_publico}.class_fiscal where CODIGO=${codigo};` 
      await conn.query(sql,(err, result)=>{
        if(err){
          reject(err);
        }else{  
          resolve(result);
        }
      })
    })
  }

  async buscaUnidades ( codigo:any):Promise< [ { PRODUTO:number, DESCRICAO:string, SIGLA: string } ] >{
    return new Promise( async (resolve, reject)=>{
        const sql = `SELECT  PRODUTO, DESCRICAO, SIGLA  FROM ${db_publico}.unid_prod where PRODUTO = ${codigo} AND item = 1 ;` 
      await conn.query(sql,(err, result)=>{
        if(err){
          console.log(`Ocorreu um erro ao tentar consultar as unidade de medido do produto: ${codigo}` , err)
          reject(err);
        }else{  
          resolve(result);
        }
      })
    })
  }


}
