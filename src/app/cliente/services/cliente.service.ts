import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  cliente: any = { nome: 'cleitin', salario: 2000 }

  gerente: any = {}

  movimentacao: any = []

  conta = { id: 1, cliente: this.cliente, gerente: this.gerente, movimentacao: this.movimentacao, saldo: 500, limite: 1000 }

  constructor() { }

  saque(valor: number): boolean {
    if (valor > 0) {
      this.conta.saldo -= valor;
      this.registrarTransacao('SAQUE', valor, undefined, this.conta);
      return true;

    }
    
    return false;

  }


  depositar(valor: number) {

    if (valor > 0) {

      this.conta.saldo += valor;
      console.log('valor deposito:' + valor)
      console.log('valor saldo: ' + this.conta.saldo)
      //mexendo só em uma conta então da pra fazer essa jaguarice
      this.registrarTransacao('DEPOSITO', valor, undefined, this.conta)
      return true;

    }

    return false;

  }

  tranfere() {

  }


  // registra uma transação duvidosa
  registrarTransacao(tipo: string, valor: number, contaOrigem?: any, contaDestino?: any) {
    let transacao = { date: new Date(), type: tipo, value: valor, origin: contaOrigem, destiny: contaDestino };

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

}
