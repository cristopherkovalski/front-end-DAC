import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, concatMap, map, of, switchMap, throwError } from 'rxjs';
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

const contas = "http://localhost:3000/conta/";


const contasPorCliente = "http://localhost:3000/contas/conta:id_cliente";

const auth = "http://localhost:3000/auth";
const url_conta = "http://localhost:3000/contas/";

const saga = "http://localhost:3000/saga";

const LS_CHAVE: string = "usuarioLogado";

@Injectable({
  providedIn: 'root'
})
export class GerenteService {

  constructor(private http: HttpClient, private loginService: LoginService, private clienteService:ClienteService) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-type": "application/json",
      'x-access-token': this.loginService.token
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
    
    let url = contas + "gerente/" + id_gerente;

    // let url = acconts_waiting.replace(':id', id_gerente.toString());
  
    return this.http.get<Conta[]>(url, this.httpOptions).pipe(
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
    let url = saga + "/clientes/aprovacao/"+cliente.id;

    return this.clienteService.getAccontByClientId(cliente.id).pipe(
      switchMap((conta: Conta) => {
        conta.situacao = "APROVADO";
        console.log(conta);
        return this.http.put(url, conta, this.httpOptions);
      })
    )


    // return this.clienteService.getAccontByClientId(cliente.id).pipe(
    //   switchMap((conta: Conta) => {
    //     conta.situacao = "APROVADO";
    //     console.log(conta);
    //     return this.http.put(contas + conta.id, conta, this.httpOptions);
    //   }),
    //   switchMap(() => {
    //     return this.http.get(auth + "/?id_user=" + cliente.id + "&type=CLIENTE", this.httpOptions);
    //   }), 
    //   switchMap((auth:any) => {
    //     let aux = auth[0];
    //     let a ={"senha": this.generateRandomPassword().toString()}
    //     let url = "http://localhost:3000/auth/" + aux.id
    //     console.log("Resultado da segunda chamada:", aux);
    //     return this.http.patch(url, a, this.httpOptions);
    //   })
      // switchMap(() => {
      //   return this.http.get(auth + cliente.id, this.httpOptions);
      // }),       
    // );

  }

  reprovarCliente(cliente:Cliente, motivo:string):Observable<any>{ //só retorna a senha do cara por hora

    let url = saga + "/clientes/reprovacao/"+cliente.id;
    
    return this.clienteService.getAccontByClientId(cliente.id).pipe(
      switchMap((conta: Conta) => {
        conta.situacao = "INATIVA";
        conta.observacao = motivo;
        return this.http.put(url, conta, this.httpOptions);
      })
    )


    // return this.clienteService.getAccontByClientId(cliente.id).pipe(
    //   switchMap((conta:Conta) =>{
    //     conta.situacao = "RECUSADO";
    //     conta.observacao = motivo;

    //     // return this.http.put(contas + conta.id, JSON.stringify(conta), this.httpOptions);
    //     return this.http.delete(contas + conta.id,this.httpOptions)
    //   }),
    //   switchMap(() => {
    //     return this.http.delete("http://localhost:3000/clientes/" + cliente.id, this.httpOptions)
    //   }),
    //   switchMap(() => {
    //     return this.http.get(auth + "/?id_user=" + cliente.id + "&type=CLIENTE", this.httpOptions);
    //   }),
    //   switchMap((auth:any) => {
    //     let aux = auth[0];
    //     let url = "http://localhost:3000/auth/" + aux.id
    //     return this.http.delete(url, this.httpOptions);
    //   })
      
    // )

  }

  generateRandomPassword(): string {
    const min = 1000; // Menor número de 4 dígitos (1000)
    const max = 9999; // Maior número de 4 dígitos (9999)
    const randomPassword = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomPassword.toString();
  }

  //mudar saporra depois
  listarTodosClientes(sort:string|null = null, orderby:string|null = null, limit: string|null = null): Observable<Cliente[]> {
    let url = clientes;
    
    if(sort)
      url += `?_sort=${sort}`;

    if (limit)
      url += (url.includes('?') ? '&' : '?') + `_order=${orderby}`;
     
    if (limit)
        url += (url.includes('?') ? '&' : '?') + `_limit=${limit}`;
      
    return this.http.get<Cliente[]> (url , this.httpOptions);

  }

  listarTopClientes(id_gerente:number){
    let url = "http://localhost:3000/gerentes/"+id_gerente+"/tops/";
    console.log(url);
    return this.http.get<Cliente[]> (url , this.httpOptions);
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