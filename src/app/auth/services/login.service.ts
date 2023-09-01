import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';


import { Usuario } from 'src/app/shared/models/usuario.model';
import { Login } from 'src/app/shared/models/login.model';


const LS_CHAVE: string = "usuarioLogado";
const url = "http://localhost:3000/auth"


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpOptions = {
    headers: new HttpHeaders({
      "Content-type": "application/json"
    })
  }

  constructor(private http: HttpClient) { }


  public get usuarioLogado():Usuario{
    let user = localStorage[LS_CHAVE];
    return (user ? JSON.parse(localStorage[LS_CHAVE]) : null);
  }

  public set usuarioLogado(usuario:Usuario){
    localStorage[LS_CHAVE] = JSON.stringify(usuario);
  }


  login(login:Login):Observable<Usuario| null>{
    
    if(login.login == 'cliente@cliente.com'){
      return of(new Usuario(1,"cleitin", "1234",login.login, "CLIENTE"));
    }else if(login.login == 'gerente@gerente.com'){
      return of(new Usuario(1,"tulio", "4321",login.login, "GERENTE"));
    }else if(login.login == 'admin@admin'){
      return of(new Usuario(1,"celso", "admin",login.login, "ADMIN"));
    }else{
      return of(null); 
    } 
  }

  logar(login:Login):Observable<Usuario| null>{
    if (login && login.login && login.senha) {
      const params = new HttpParams().set(
        'email', login.login).set(
        'senha', login.senha)

      return this.http.get<Usuario>(url, {params: {email: login.login,senha: login.senha}})
        .pipe(
          map((data:any) =>{
            return data[0]  //por algum motivo json_server retorna como uma lista
          })
        )
    }else{
      return of(null); 
    }
  }


  logout(){
    delete localStorage[LS_CHAVE];
  }


}
