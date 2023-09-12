import { Component } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { AdminService } from '../services/admin.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent {
  gerentes: Gerente[] = [];
  contas: Conta[] = [];
  erro: string | null = null;



  constructor(private login: LoginService, private router: Router, private adminService: AdminService) {



  }

  ngOnInit(): void {
    // Fazer as duas chamadas assíncronas e aguardar que ambas sejam concluídas
    forkJoin([
      this.adminService.getGerentesList(),
      this.adminService.getContasList()
    ]).subscribe({
      next: ([gerentes, contas]) => {
        this.gerentes = gerentes;
        this.contas = contas;
        // Agora que ambas as listas estão atualizadas, você pode calcular os valores
      },
      error: (error) => {
        this.erro = 'Ocorreu um erro ao buscar os dados: ' + error.message;
      }
    });
  }

  

  getTotalPositivo(id: number | undefined) {
    return this.calcularSaldoTotalPositivo(this.contas, id!);

  }

  getTotalNegativo(id: number | undefined) {
    return this.calcularSaldoTotalNegativo(this.contas, id!);
  }

  getTotalClientes(id: number | undefined) {
    return this.getTotalClientesPorGerente(this.contas, id!);
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



  formatCurrency(value: number): string {

    const formattedValue = Number(value).toFixed(2);


    const [integerPart, decimalPart] = formattedValue.split('.');

    const integerWithSeparator = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const formattedCurrency = `R$ ${integerWithSeparator},${decimalPart}`;

    return formattedCurrency;
  }


  verifyLogin(): boolean {
    if (this.login.usuarioLogado) {
      return true;
    } else {
      return false;
    }

  }






}
