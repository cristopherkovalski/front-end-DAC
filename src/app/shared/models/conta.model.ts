import { Cliente } from "./cliente.model";
import { Gerente } from "./gerente.model";

export class Conta {

    constructor(
        public id?: number,
        // public cliente?: Cliente,
        public id_cliente?: number,
        public gerenteId?: number,
        //public movimentacao: Movimentcao,
        public saldo?: number,
        public limite?: number,
        public situacao?: string,
        public observacao?:string,
    ) { }

}