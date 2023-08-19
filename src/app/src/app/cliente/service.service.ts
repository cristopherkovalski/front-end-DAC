import { Injectable } from '@angular/core';

const cliente = {nome:'cleitin', salario: 2000}

const gerente = {}

const movimentacao = [{}, {},{}]

const conta = {id: 1, cliente: cliente,gerente: gerente, movimentacao: movimentacao, saldo: 0, limite: 1000}


@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor() {}

  saque(){
    //acessa a conta vagabundo
    console.log('fds')
  }


  deposita(){

  }


  tranfere(){
    
  }
}
