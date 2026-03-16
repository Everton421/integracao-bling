import ConfigApi from "../../Services/api/api";
import {  PedidoRepository } from "../../dataAcess/pedido-repository/pedido-repository";
import { PedidoApiRepository } from "../../dataAcess/api-pedido-repository/pedido-api-repository";
import { SyncClient } from "../../Services/sync-client/sync-client";

export class pedidoController{

    private api = new ConfigApi();
    private pedidoApi = new PedidoApiRepository();
    private objPedidoErp = new PedidoRepository();
    private syncClient = new SyncClient();


     delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



 
}
