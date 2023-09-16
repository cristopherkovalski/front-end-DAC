import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { Observable, of, map, catchError, throwError, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { LoginService } from 'src/app/auth/services/login.service';
import { Conta } from 'src/app/shared/models/conta.model';

const LS_CHAVE: string = "usuarioLogado";

const url_conta = "http://localhost:3000/contas/";

const apiUrl = "http://localhost:3000/clientes"

const url_movimentacao = "http://localhost:3000/contas/:id/movimentacoes";

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

 cliente2 = new Cliente();

  httpOptions = {
    headers: new HttpHeaders({
      "Content-type": "application/json"
    })
  }

  
  constructor(private http: HttpClient, private loginService: LoginService) {
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
    //this.cliente2 = new Cliente(1, "Teste", "testegmail.com", "09161477974", new Endereco("rua", "do saci", "300", "casa", "81240510", "curitiba", "Paraná"), "4232458124", 3000);
    
  }


  // public clienteLogado(): any {
  //   let clienteLogado = localStorage[LS_CHAVE];
  //   return clienteLogado ? JSON.parse(clienteLogado) : null;
  // }

  public getUsuarioLogado(): Usuario {   //usar esse para buscar usuario logado
      console.log(this.loginService.usuarioLogado)
      let user = this.loginService.usuarioLogado;
      return user;
  }
  
  
  public buscarCliente(id: number | undefined): Observable<Cliente> {
  const url = `${apiUrl}/${id}`; 
    return this.http.get<Cliente>(url);
  }

  

  public atualizarCliente(cliente: Cliente): Observable<string> {
    const url = `${apiUrl}/${cliente.id}`; 
    return this.http.patch<Cliente>(url, cliente)
      .pipe(
        map(() => 'Cliente atualizado com sucesso'), 
        catchError(() => 'Erro ao atualizar o cliente') 
      );
  }

  public buscarContaPorClienteId(id:number):Observable<any>{
    //faz a requisição e volta uma conta por hora só volta o json
    return of(this.conta);
  }


  public getAccontByClientId(id:number):Observable<Conta>{
    const params = new HttpParams().set('id_cliente', id)
    return this.http.get<Conta[]>(url_conta, {params}).pipe(
        map((resposta: Conta[]) => {
            return resposta[0]; // Retorna o primeiro objeto da resposta
        })
      );
  }

  sacar(valor: number, conta:any):Observable<any> {
    if (valor > 0) {
      const data = {
        saldo: conta.saldo - valor
      }

      return this.http.patch<any>(url_conta + conta.id, JSON.stringify(data),this.httpOptions)  //fazer model de conta dps, e transformar em post
              .pipe(
                  tap((response) => {
                    this.registrarTransacaoJson('SAQUE', valor, conta.id).subscribe((r) => console.log("registro feito")) // n vai precisa disso depois
                  }),
                  catchError((error) => {
                    return throwError(() => new Error('Falha ao sacar. Por favor, tente novamente mais tarde.'));
                  })
      );

    }else{
      return of(null);
    }
  }



  depositar(valor: number, conta:any):Observable<any> {
    //essa logica vai mudar tbm, só vai fazer o deposito no back, aqui só trata o valor e pronto
    if (valor > 0) {
      const data = {
        saldo: conta.saldo + valor
      }

      return this.http.patch<any>(url_conta + conta.id, JSON.stringify(data),this.httpOptions)  //fazer model de conta dps, e transformar em post
              .pipe(
                  tap((response) => {
                    this.registrarTransacaoJson('DEPOSITO', valor, conta.id).subscribe((r) => console.log("registro feito")) // n vai precisa disso depois
                  }),
                  catchError((error) => {
                    return throwError(() => new Error('Falha ao depositar. Por favor, tente novamente mais tarde.'));
                  })
      );

    }else{
      return of(null);
    }
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
      dataHora: new Date().toJSON(), // Adicione esta linha para incluir a data e hora atual
      type: tipo,
      value: valor,
      conta_id: contaOrigem,
      conta_destiny: contaDestino
    };
  
    this.movimentacao.push(transacao);
  }
  
   // isso aqui vai morrer jaja, 
  registrarTransacaoJson(tipo: string, valor: number, contaOrigem?: any, contaDestino?: any):Observable<any>{

    let url = url_movimentacao.replace(':id', contaOrigem.toString());
    const transacao = {
      dataHora: new Date().toJSON(), // Adicione esta linha para incluir a data e hora atual
      type: tipo,
      value: valor,
      conta_id: contaOrigem,
      conta_destiny: contaDestino ? contaDestino : null
    };
    return this.http.post(url, JSON.stringify(transacao), this.httpOptions);
  }

  
  // {
  //   "id": 1,
  //   "conta_id":1,
  //   "dataHora": "10:10:10 01/08/2023",
  //   "type":"DEPOSITO",
  //   "conta_destiny": null,
  //   "valor":100
  // }


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
function next(): import("rxjs").OperatorFunction<any, any> {
  throw new Error('Function not implemented.');
}

