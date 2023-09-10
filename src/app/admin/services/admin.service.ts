import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/auth/services/login.service';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { Observable, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  gerenteUrl = 'http://localhost:3000/gerentes';
  contaUrl = 'http://localhost:3000/contas';
  clienteUrl = 'http://localhost:3000/clientes';


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


}
