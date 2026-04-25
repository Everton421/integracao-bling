import { NfRepository } from "../dataAcess/nf-repository/nf-repository";
import { NfMapper } from "../mappers/nf-mapper";
import { SyncNaturezaOperacao } from "../Services/sync-wire-tapping-operations/sync-wire-tapping-operations";
import { SyncNf } from "../Services/sync-nf/sync-nf";

export async function testeNaturezaOperacao(){
                const syncNaturezaOperacao = new SyncNaturezaOperacao();

                const resultRequest = await syncNaturezaOperacao.getWiretappingOperations();
                        console.log(resultRequest);
}


