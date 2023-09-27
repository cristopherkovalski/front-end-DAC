import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/auth/services/login.service';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { Observable, map, catchError, switchMap, forkJoin, of } from 'rxjs';
import { Usuario } from 'src/app/shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 private gerenteUrl = 'http://localhost:3000/gerentes';
 private  contaUrl = 'http://localhost:3000/contas';
 private  clienteUrl = 'http://localhost:3000/clientes';
 private  usuarioUrl = 'http://localhost:3000/auth'


  constructor(private http: HttpClient, private loginService: LoginService) {

  }

  getGerentesList(): Observable<Gerente[]> {
    return this.http.get<Gerente[]>(this.gerenteUrl);
  }


  getContasList(): Observable<Conta[]> {
    return this.http.get<Conta[]>(this.contaUrl);
  }


  getClientesList(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.clienteUrl);
  }

  adicionarGerente(gerente: Gerente): Observable<Gerente> {
    return this.http.post(this.gerenteUrl, gerente);
  }

  atualizarConta(conta: Conta): Observable<Conta> {
    const url = `${this.contaUrl}/${conta.id}`;
    return this.http.patch<Conta>(url, conta)
      .pipe(
        map((contaAtualizada: Conta) => contaAtualizada),
        catchError((error: any) => {
          console.error('Erro ao atualizar a conta', error);
          throw error;
        })
      );
  }

  atualizarGerente(gerente: Gerente): Observable<Gerente> {
    const url = `${this.gerenteUrl}/${gerente.id}`;
    return this.http.patch<Gerente>(url, gerente)
      .pipe(
        map((gerenteAtualizado: Gerente) => gerenteAtualizado),
        catchError((error: any) => {
          console.error('Erro ao atualizar o gerente', error);
          throw error;
        })
      )


  }

  atualizarGerenteIdDaConta(contaId: number, novoGerenteId: number): Observable<Conta> {
    const url = `${this.contaUrl}/${contaId}`;
    const body = { gerenteId: novoGerenteId };
    return this.http.patch<Conta>(url, body);
  }

  

  inserirAutenticacao(usuario: Usuario): Observable<Usuario>{
    return this.http.post(this.usuarioUrl, usuario);
  }

  

  getContasPorGerente(gerenteId: number): Observable<Conta[]> {
    const url = `${this.contaUrl}/?gerenteId=${gerenteId}`;
    return this.http.get<Conta[]>(url);
  }

  excluirGerente(gerente: Gerente): Observable<Gerente> {
    const url = `${this.gerenteUrl}/${gerente.id}`;
    return this.http.delete<Gerente>(url);
  }

}


