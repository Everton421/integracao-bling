export interface IConfig   { 
Id:number
importar_pedidos:number
enviar_estoque:number
enviar_precos:number
tabela_preco:number
enviar_produtos: 'E'| 'S' // S = gerar vinculo do produto | E = faz o envio\atualização do produto
vendedor:number
setor:number
}
