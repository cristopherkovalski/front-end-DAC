export class Endereco {

    constructor(
        public tipo: string = '',
        public logradouro: string = '',
        public numero: string = '',
        public complemento: string = '',
        public cep: string = '',
        public cidade: string = '',
        public estado: string = ''
    ){}
}
