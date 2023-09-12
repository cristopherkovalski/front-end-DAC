import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap, map, of, switchMap } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { ClienteService } from 'src/app/cliente/services/cliente.service';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { Login } from 'src/app/shared/models/login.model';


import { Usuario } from 'src/app/shared/models/usuario.model';


// const acconts_waiting = "http://localhost:3000/clientes"


const acconts_waiting = "http://localhost:3000/gerentes/:id/contas/analise/";

// /gerentes/:id/contas/analise

const clientes = "http://localhost:3000/clientes";

const contas = "http://localhost:3000/contas/";

const contasPorCliente = "http://localhost:3000/contas/conta:id_cliente";

const auth = "http://localhost:3000/auth/";
const url_conta = "http://localhost:3000/contas/";

const LS_CHAVE: string = "usuarioLogado";

@Injectable({
  providedIn: 'root'
})
export class GerenteService {

  constructor(private http: HttpClient, private loginService: LoginService, private clienteService:ClienteService) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-type": "application/json"
    })
  }


  public gerenteLogado(): any {
    let clienteLogado = localStorage[LS_CHAVE];
    return clienteLogado ? JSON.parse(clienteLogado) : null;
  }


  public getUsuarioLogado(): any {
    console.log(this.loginService.usuarioLogado)
    let user = this.loginService.usuarioLogado;
    return user;
  }

  // getClientesAprovacao(id_gerente:number):Observable<Cliente[] | null>{

  //   let url = acconts_waiting.replace(':id', id_gerente.toString());
  
  //   return this.http.get<Cliente[]>(url).pipe(
  //     map((resposta: Cliente[]) => {
  //       if (resposta && resposta.length > 0) {
  //         return resposta; // Retorna o primeiro objeto da resposta
  //       } else {
  //         return null;
  //       }
  //     })
  //   );
  // }


  getClientesById(id_cliente:number){
    return this.clienteService.buscarCliente(id_cliente);
  }

  getContasAprovacao(id_gerente:number):Observable<Conta[] | null>{

    let url = acconts_waiting.replace(':id', id_gerente.toString());
  
    return this.http.get<Conta[]>(url).pipe(
      map((resposta: Conta[]) => {
        if (resposta && resposta.length > 0) {
          return resposta; // Retorna o primeiro objeto da resposta
        } else {
          return null;
        }
      })
    );


  }

  //pensar muito bem nisso daqui pq vai ser bucha essa parada
  //verificar se faz saga(acho q n precisa) ou mensageria normal(acho q faz mais sentido)
  
  aprovarCliente(cliente:Cliente):Observable<any>{ //só retorna a senha do cara por hora
    return this.clienteService.getAccontByClientId(cliente.id).pipe(
      switchMap((conta: Conta) => {
        conta.situacao = "APROVADO";
        return this.http.put(contas + cliente.id, JSON.stringify(conta), this.httpOptions);
      }),
      switchMap(() => {
        return this.http.get(auth + cliente.id, this.httpOptions);
      })
             
    );
  }

  reprovarCliente(cliente:Cliente, motivo:string):Observable<any>{ //só retorna a senha do cara por hora
    return this.clienteService.getAccontByClientId(cliente.id).pipe(
      switchMap((conta:Conta) =>{
        conta.situacao = "RECUSADO";
        conta.observacao = motivo;
        return this.http.put(contas + cliente.id, JSON.stringify(conta), this.httpOptions);
      })
    )


  }

  generateRandomPassword(): string {
    const min = 1000; // Menor número de 4 dígitos (1000)
    const max = 9999; // Maior número de 4 dígitos (9999)
    const randomPassword = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomPassword.toString();
  }


  listarTodosClientes(): Observable<Cliente[]> {
    
    return this.http.get<Cliente[]> (clientes, this.httpOptions);

  }

  listarTodosContas(): Observable<Conta[]> {

    return this.http.get<Conta[]> (contas, this.httpOptions);

  }

  listarClienteConta(cliente: Cliente): Observable<Conta[]> {

    let cliente_conta = contasPorCliente.replace(':id_cliente', cliente.id.toString());
    return this.http.get<Conta[]> (cliente_conta, this.httpOptions);

  }

  public getAccontByClientId(id:number):Observable<Conta>{
    const params = new HttpParams().set('id_cliente', id)
    return this.http.get<Conta[]>(url_conta, {params}).pipe(
        map((resposta: Conta[]) => {
            return resposta[0]; // Retorna o primeiro objeto da resposta
        })
      );
  }


}
