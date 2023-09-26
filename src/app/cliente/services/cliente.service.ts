import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { Observable, of, map, catchError, throwError, tap, forkJoin } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { LoginService } from 'src/app/auth/services/login.service';
import { Conta } from 'src/app/shared/models/conta.model';

const LS_CHAVE: string = "usuarioLogado";

const url_conta = "http://localhost:3000/contas/";

const apiUrl = "http://localhost:3000/clientes"

const url_movimentacao = "http://localhost:3000/contas/:id/movimentacoes";


// http://localhost:3000/movimentacoes?conta_id=1&_sort=dataHora

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  movimentacao: any[] = [];


  movimentacao1: any[] = [];


 cliente2 = new Cliente();

  httpOptions = {
    headers: new HttpHeaders({
      "Content-type": "application/json"
    })
  }

  
  constructor(private http: HttpClient, private loginService: LoginService) {
    
    
  }



  public getUsuarioLogado(): Usuario {   //usar esse para buscar usuario logado
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
                    this.registrarTransacaoJson('SAQUE', valor, data.saldo,conta.id ).subscribe((r) => console.log("registro feito")) // n vai precisa disso depois
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
                    this.registrarTransacaoJson('DEPOSITO', valor, data.saldo, conta.id).subscribe((r) => console.log("registro feito")) // n vai precisa disso depois
                  }),
                  catchError((error) => {
                    return throwError(() => new Error('Falha ao depositar. Por favor, tente novamente mais tarde.'));
                  })
      );

    }else{
      return of(null);
    }
  }

  transfere(valor: number, contaOrigem: any, contaDestino: any): Observable<any> {
    if (valor > 0 && valor <= contaOrigem.saldo) {
      const saldoOrigem = contaOrigem.saldo - valor;
      const dataOrigem = { saldo: saldoOrigem };
      const saldoDestino = contaDestino.saldo + valor;
      const dataDestino = { saldo: saldoDestino };
      const transferencia = {
        contaOrigem: contaOrigem.id,
        contaDestino: contaDestino.id,
        valor: valor
      };

      const atualizacaoOrigem = this.http.patch<any>(url_conta + contaOrigem.id, JSON.stringify(dataOrigem), this.httpOptions);
      const atualizacaoDestino = this.http.patch<any>(url_conta + contaDestino.id, JSON.stringify(dataDestino), this.httpOptions);

      const registroTransacaoOrigem = this.registrarTransacaoJson('TRANSFERENCIA', valor, saldoOrigem, contaOrigem.id, contaDestino.id);
      const registroTransacaoDestino = this.registrarTransacaoJson('TRANSFERENCIA', valor, saldoDestino, contaDestino.id, null);

      return forkJoin([atualizacaoOrigem, atualizacaoDestino, registroTransacaoOrigem, registroTransacaoDestino]);
    } else {
      return of(null); 
    }
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
  registrarTransacaoJson(tipo: string, valor: number, saldo:number, contaOrigem?: any, contaDestino?: any):Observable<any>{
    let url = url_movimentacao.replace(':id', contaOrigem.toString());
    const transacao = {
      dataHora: new Date().toJSON(), // Adicione esta linha para incluir a data e hora atual
      type: tipo,
      value: valor,
      conta_id: contaOrigem,
      conta_destiny: contaDestino ? contaDestino : null,
      saldo_final: saldo
    };
    return this.http.post(url, JSON.stringify(transacao), this.httpOptions);
  }

  // isso aqui vai morrer jaja, 
  getMovimentacoesPorIdConta(conta: any):Observable<any>{
    return this.http.get(url_movimentacao.replace(':id', conta.toString()) , this.httpOptions);
  }

  getMovimentacoesPorIdContaDestiny(conta:any):Observable<any>{
    return this.http.get(url_movimentacao.replace(':id', conta.toString()) + "/destiny" , this.httpOptions);
  }


}
function next(): import("rxjs").OperatorFunction<any, any> {
  throw new Error('Function not implemented.');
}

