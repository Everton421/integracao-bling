import { NfRepository } from "../dataAcess/nf-repository/nf-repository";
import { NfMapper } from "../mappers/nf-mapper";
import { SyncNf } from "../Services/sync-nf/sync-nf";

export async function testeNf(){
const nfMapper = new NfMapper();

const nfRepository = new NfRepository();


            const [dadosNf] = await nfRepository.findDadosNota(1);

    const intensNF = await nfRepository.findItensNota(468);
    const [clientNF] = await nfRepository.findCliente(72) 
    const tribNf = await nfRepository.findTributosItem(468)
    const nfInstallments = await nfRepository.findInstallments(468);

    const nfMapping = nfMapper.mapToBlingFormat(dadosNf,intensNF,clientNF,  tribNf, nfInstallments);
    
    const syncNf = new SyncNf();

         await syncNf.postNf(nfMapping);
}


