import { Endereco } from "./endereco.model";

export class Cliente {
    constructor(
      public id: number = 0,
      public nome: string = '',
      public email: string = '',
      public cpf: string = '',
      public tipo: string = '',
      public logradouro: string = '',
      public numero: string = '',
      public complemento: string = '',
      public cep: string = '',
      public cidade: string = '',
      public estado: string = '',
      public telefone: string = '',
      public salario: number = 0,
      // public situacao: string = '',
      public id_gerente?: number,
    ) {}
    //falar com cristopher depois sobre isso
}