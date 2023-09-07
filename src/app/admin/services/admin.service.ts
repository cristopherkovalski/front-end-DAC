import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/auth/services/login.service';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  gerenteUrl = 'http://localhost:3000/gerentes';
  contaUrl = 'http://localhost:3000/contas'


  constructor(private http: HttpClient, private loginService: LoginService) {

  }

  getGerentesList(): Observable<Gerente[]> {
    return this.http.get<Gerente[]>(this.gerenteUrl);
  }


  getContasList(): Observable<Conta[]> {
    return this.http.get<Conta[]>(this.contaUrl);
  }




  calcularSaldoTotalPositivo(contas: Conta[], gerenteId: number): number {

    const contasDoGerente = contas.filter((conta) => conta.gerenteId === gerenteId);
    
    let saldoTotalPositivo = 0;
    for (const conta of contasDoGerente) {
      if (conta.saldo && conta.saldo > 0) {
        saldoTotalPositivo += conta.saldo;
      }
    }

    return saldoTotalPositivo;
  }

  calcularSaldoTotalNegativo(contas: Conta[], gerenteId: number): number {

    const contasDoGerente = contas.filter((conta) => conta.gerenteId === gerenteId);

    let saldoTotalNegativo = 0;
    for (const conta of contasDoGerente) {
      if (conta.saldo && conta.saldo < 0) {
        saldoTotalNegativo += conta.saldo;
      }
    }

    return saldoTotalNegativo;
  }

  getTotalClientesPorGerente(contas: Conta[], gerenteId: number): number {
    const contasDoGerente = contas.filter((conta) => conta.gerenteId === gerenteId);
    return contasDoGerente.length;
  }




}
