
require('dotenv').config();
import mysql from 'mysql';

/**----------------------------------------------------------------------- */
        const hostname = process.env.DB_HOST ;
        const portdb = process.env.DB_PORT;
        const username = process.env.DB_USER;
        const dbpassword = process.env.DB_PASSWORD;

        let port:any | undefined;

if(portdb !== undefined){
    port  = parseInt(portdb);
}

        export const db_publico = process.env.DB_PUBLICO;
        export const db_vendas = process.env.DB_VENDAS;
        export const db_estoque = process.env.DB_ESTOQUE;
        export const db_financeiro = process.env.DB_FINANCEIRO;




        export const conn =   mysql.createPool({
            connectionLimit : 10,
            host: hostname,
            user: username,
            port: port,
            password: dbpassword,
        })
        console.log("Usuario: ",username)
        console.log("Senha: ",dbpassword)

/**----------------------------------------------------------------------- */



        let port_db_api:any | undefined;

        const hostApi    = process.env.HOST_API;
        const userApi = process.env.USER_API;
         const senhaApi = process.env.PASSWORD_API;
         export const db_api = process.env.DB_API;
        if(portdb !== undefined){
            port_db_api  = parseInt(portdb);
        }

        export const database_api =process.env.DB_API

       export const conn_api =   mysql.createPool({
            connectionLimit : 10,
            host: hostApi,
            user: userApi,
            port: port_db_api,
            password: senhaApi,
            database:db_api
        })





      //  conn.getConnection( (err)=>{
      //      if(err){
      //          console.log(err);
      //      }else{
      //          console.log('conectado')
      //      }
      //  })
/*---------------------------------------------------------------------*/ 
        

