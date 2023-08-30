//TYPE ADMIN, GERENTE CLIENTE
export class Usuario {
    constructor(
        public id?:number,
        public nome?:string,
        public password?: string,
        public email?: string,
        public type?: string,
    ) {}
}
