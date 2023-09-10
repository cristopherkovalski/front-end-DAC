import { Component } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta } from 'src/app/shared/models/conta.model';

@Component({
  selector: 'app-relatorio-clientes',
  templateUrl: './relatorio-clientes.component.html',
  styleUrls: ['./relatorio-clientes.component.css']
})
export class RelatorioClientesComponent {
  gerentes: Gerente[] = [];
  contas: Conta[] = [];
  clientes: Cliente[] = [];
  erro: string | null = null;

    constructor(private login: LoginService, private router: Router, private adminService: AdminService ){}

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
          console.log(contas);
          this.contas = contas;
        },
        error: (error) => {
          this.erro = 'Ocorreu um erro ao buscar as contas: ' + error.message;
        }
      });
      this.adminService.getClientesList().subscribe({
        next: (clientes) => {
          this.clientes = clientes;
        },
        error: (error) => {
          this.erro = 'Ocorreu um erro ao buscar as contas: ' + error.message;
        }
      });
  
    }

    getContaByClienteId(id: number){

    }

    verifyLogin(): boolean {
      if (this.login.usuarioLogado) {
        return true;
      } else {
        return false;
      }
  
    }
  
}
