//TYPE ADMIN, GERENTE CLIENTE
export class Usuario {
    constructor(
        public id?:number,
        public nome?:string,
        public senha?: string,
        public email?: string,
        public type?: string,
        public id_user?:number,
    ) {}
}