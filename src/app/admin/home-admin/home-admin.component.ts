import { Component } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { AdminService } from '../services/admin.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    this.adminService.getGerentesList().subscribe({
      next: (gerentes) => {
        this.gerentes = gerentes;
      },
      error: (error) => {
        this.erro = 'Ocorreu um erro ao buscar os gerentes: ' + error.message;
      }
    });
    this.adminService.getContasList().subscribe({
      next: (contas) => {
        this.contas = contas;
      },
      error: (error) => {
        this.erro = 'Ocorreu um erro ao buscar as contas: ' + error.message;
      }
    });

  }

  getTotalPositivo(id: number | undefined) {
    return this.adminService.calcularSaldoTotalPositivo(this.contas, id!);

  }

  getTotalNegativo(id: number | undefined) {
    return this.adminService.calcularSaldoTotalNegativo(this.contas, id!);
  }

  getTotalClientes(id: number | undefined) {
    return this.adminService.getTotalClientesPorGerente(this.contas, id!);
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
