import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { Observable, of, map, catchError, throwError, tap, forkJoin, switchMap } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { LoginService } from 'src/app/auth/services/login.service';
import { Conta } from 'src/app/shared/models/conta.model';

const LS_CHAVE: string = "usuarioLogado";

const url_conta = "http://localhost:3000/conta";

const apiUrl = "http://localhost:3000/clientes";

const sagaURL = "http://localhost:3000/saga";


const url_movimentacao = "http://localhost:3000/contas/:id/movimentacoes";

const url_movimentacao_basica = "http://localhost:3000/contas/:id/movimentacoes/transferencias"
const url_movimentacao_destiny = "http://localhost:3000/contas/:id/movimentacoes/transferencias/destiny"

const auth = "http://localhost:3000/auth";


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
      "Content-type": "application/json",
      'x-access-token': this.loginService.token
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

    return this.http.get<Cliente>(url , this.httpOptions);
  }


  

  public atualizarCliente(cliente: any): Observable<any> {
    const url = `${sagaURL}/clientes/${cliente.id}`; 

    // return this.http.patch<Cliente>(url, cliente)
    //   .pipe(
    //     map(() => 'Cliente atualizado com sucesso'), 
    //     catchError(() => 'Erro ao atualizar o cliente') 
    //   );

    return this.http.put<Cliente>(url,cliente, this.httpOptions).pipe(
      catchError((error) => {
        return throwError(() => new Error('Falha ao atualizar cliente. Por favor, tente novamente mais tarde.'));
      })
    );
    

    
  }

  public getAccontByClientId(id:any):Observable<Conta>{
    const headers = new HttpHeaders({
      'x-access-token': this.loginService.token
    });
    return this.http.get<Conta>(url_conta + "/" + id, { headers }).pipe(
        map((resposta: Conta) => {
            return resposta; // Retorna o primeiro objeto da resposta
        })
      );
  }

  sacar(valor: number, conta:any):Observable<any> {
    if (valor > 0) {
      const data = {
        valor: valor
      }

      return this.http.post<any>(url_conta +"/saque/"+ conta.id, JSON.stringify(data),this.httpOptions)  //fazer model de conta dps, e transformar em post
              .pipe(
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
        valor: valor
      }


      return this.http.post<any>(url_conta +"/deposito/"+ conta.id, JSON.stringify(data), this.httpOptions)  //fazer model de conta dps, e transformar em post
              .pipe(
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

      let data ={
        valor: valor,
        id_cliente: contaDestino.id
      }
      // const saldoOrigem = contaOrigem.saldo - valor;
      // const dataOrigem = { saldo: saldoOrigem };
      // const saldoDestino = contaDestino.saldo + valor;
      // const dataDestino = { saldo: saldoDestino };
      // const transferencia = {
      //   contaOrigem: contaOrigem.id,
      //   contaDestino: contaDestino.id,
      //   valor: valor
      // };

      return this.http.post<any>(url_conta +"/transferencia/"+ contaOrigem.id, JSON.stringify(data), this.httpOptions)  //fazer model de conta dps, e transformar em post
              .pipe(
                  catchError((error) => {
                    return throwError(() => new Error('Falha ao realizar transferencia. Por favor, tente novamente mais tarde.'));
                  })
      );
      // return this.this.post<any>(url_conta)

      // const atualizacaoOrigem = this.http.patch<any>(url_conta + contaOrigem.id, JSON.stringify(dataOrigem), this.httpOptions);
      // const atualizacaoDestino = this.http.patch<any>(url_conta + contaDestino.id, JSON.stringify(dataDestino), this.httpOptions);

      // const registroTransacaoOrigem = this.registrarTransacaoJson('TRANSFERENCIA', valor, saldoOrigem, contaOrigem.id, contaDestino.id, false);

      // const registroTransacaoDestino = this.registrarTransacaoJson('TRANSFERENCIA', valor, saldoDestino, contaOrigem.id, contaDestino.id ,true);

      // return forkJoin([atualizacaoOrigem, atualizacaoDestino, registroTransacaoOrigem, registroTransacaoDestino]);
    } else {
      return of(null); 
    }
  }
     


  // registrarTransacao(tipo: string, valor: number, contaOrigem?: any, contaDestino?: any) {
   
  //   const transacao = {
  //     dataHora: new Date().toJSON(), // Adicione esta linha para incluir a data e hora atual
  //     type: tipo,
  //     value: valor,
  //     conta_id: contaOrigem,
  //     conta_destiny: contaDestino,
  //   };
  
  //   this.movimentacao.push(transacao);
  // }
  
   // isso aqui vai morrer jaja, 
  registrarTransacaoJson(tipo: string, valor: number, saldo:number, contaOrigem?: any, contaDestino?: any , rec?:boolean):Observable<any>{
    let url = url_movimentacao.replace(':id', contaOrigem.toString());
    const transacao = {
      dataHora: new Date().toJSON(), // Adicione esta linha para incluir a data e hora atual
      type: tipo,
      value: valor,
      conta_id: contaOrigem,
      conta_destiny: contaDestino ? contaDestino : null,
      saldo_final: saldo,
      recebido: rec
    };
    return this.http.post(url, JSON.stringify(transacao), this.httpOptions);
  }

  // isso aqui vai morrer jaja, 
  getMovimentacoesPorIdConta(conta: any):Observable<any>{

    let url = url_movimentacao.replace(':id', conta.toString())
    let url_trans = url_movimentacao_basica.replace(':id', conta.toString())
    let url_destiny = url_movimentacao_destiny.replace(':id', conta.toString())

    // console.log(url)
    // return this.http.get(url_movimentacao.replace(':id', conta.toString()) , this.httpOptions);
    const Basic = this.http.get<any>(url, this.httpOptions);
    const Origem = this.http.get<any>(url_trans, this.httpOptions);
    const Destiny = this.http.get<any>(url_destiny, this.httpOptions);

    return forkJoin([Basic, Origem, Destiny ]);


  }

  getMovimentacoesPorIdContaDestiny(conta:any):Observable<any>{
    return this.http.get(url_movimentacao.replace(':id', conta.toString()) + "/destiny" , this.httpOptions);
  }


}
function next(): import("rxjs").OperatorFunction<any, any> {
  throw new Error('Function not implemented.');
}

