import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { Observable, of } from 'rxjs';

const LS_CHAVE: string = "ususarioLogado";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  cliente: { nome: string; salario: number;  email: string, senha: string};
  gerente: {};
  movimentacao: any[] = [];

  conta: { id: number; cliente: { nome: string; salario: number; }; gerente: {}; movimentacao: any[]; saldo: number; limite: number; };

  cliente1: { nome: string; salario: number; email: string, senha: string };
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
    this.cliente = { nome: 'cleitin', salario: 2000, email: 'cliente@cliente.com', senha: '1234' };
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
  
    this.cliente1 = { nome: 'outronom', salario: 2500, email: 'cliente2@cliente.com', senha: '1234' };
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


  public clienteLogado(): any {
    let clienteLogado = localStorage[LS_CHAVE];
    return clienteLogado ? JSON.parse(clienteLogado) : null;
  }
  

  public buscarContaPorClienteId(id:number):Observable<any>{
    //faz a requisição e volta uma conta por hora só volta o json
    return of(this.conta);
  }

  depositar(valor: number, id_cliente:number):Observable<any> {
    var status:boolean = false;
    if (valor > 0) {
      
      this.buscarContaPorClienteId(id_cliente).subscribe(
        conta =>{
          if (conta != null){
            conta.saldo += valor;

            this.registrarTransacao('DEPOSITO', valor, undefined, conta);  //isso aqui não vai mais existir é pra fazer no back spring
            
            status = true;
          }
        });
    }

    return of(status);
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


  registrarTransacao(tipo: string, valor: number, contaOrigem?: any, contaDestino?: any) {
    const transacao = {
      dataHora: new Date(), // Adicione esta linha para incluir a data e hora atual
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
