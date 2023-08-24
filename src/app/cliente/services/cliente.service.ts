import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  cliente: { nome: string; salario: number; };
  gerente: {};
  movimentacao: any[] = [];

  conta: { id: number; cliente: { nome: string; salario: number; }; gerente: {}; movimentacao: any[]; saldo: number; limite: number; };

  cliente1: { nome: string; salario: number; };
  gerente1: {};
  movimentacao1: any[] = [];

  conta1: { id: number; cliente: { nome: string; salario: number; }; gerente: {}; movimentacao: any[]; saldo: number; limite: number; };


  saque(valor: number): boolean {
    if (valor > 0) {
      this.conta.saldo -= valor;
      this.registrarTransacao('SAQUE', valor, undefined, this.conta);
      return true;

    }
    
    return false;
  }

  constructor() {
    this.cliente = { nome: 'cleitin', salario: 2000 };
    this.gerente = {};
    this.movimentacao = [];
    this.conta = {
      id: 1,
      cliente: this.cliente,
      gerente: this.gerente,
      movimentacao: this.movimentacao,
      saldo: 3,
      limite: 1000
    };
  
    this.cliente1 = { nome: 'outronom', salario: 2500 };
    this.gerente1 = {};
    this.movimentacao1 = [];
    this.conta1 = {
      id: 2,
      cliente: this.cliente,
      gerente: this.gerente,
      movimentacao: this.movimentacao,
      saldo: 10,
      limite: 2000
    };
  }
  

  depositar(valor: number) {
    if (valor > 0) {
      this.conta.saldo += valor;
      this.registrarTransacao('DEPOSITO', valor, undefined, this.conta);
      return true;
    }
    return false;
  }

  tranfere(valor: number) {
    if (valor > 0 && valor <= this.conta.saldo) {
      this.conta.saldo -= valor;
      this.conta1.saldo += valor;

      this.registrarTransacao('TRANSFERENCIA', valor, this.conta, this.conta1);
      return true;
    }
    return false;
  }


  // registra uma transação duvidosa
  registrarTransacao(tipo: string, valor: number, contaOrigem?: any, contaDestino?: any) {
    const transacao = {
      date: new Date(),
      type: tipo,
      value: valor,
      origin: contaOrigem,
      destiny: contaDestino
    };
  
    this.movimentacao.push(transacao);
  }
  
  


  //metodos para pegar os valores fixos. ISSO AQUI N VAI MANTER ASSIM
  getCliente() {
    return this.cliente;
  }

  getConta() {
    return this.conta;
  }

  getGerente() {
    this.gerente;
  }

  getCliente1() {
    return this.cliente1;
  }

  getConta1(){
    return this.conta1;
  }

  getGerente1(){
    this.gerente1;
  }


}
