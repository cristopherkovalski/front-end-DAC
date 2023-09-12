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

  constructor(private login: LoginService, private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.setGerentes();
    this.setContas();
    this.setClientes();

  }

  getContaByClienteId(id: number) {

  }

  verifyLogin(): boolean {
    if (this.login.usuarioLogado) {
      return true;
    } else {
      return false;
    }

  }

  setGerentes() {
    this.adminService.getGerentesList().subscribe({
      next: (gerentes) => {
        this.gerentes = gerentes;
      },
      error: (error) => {
        this.erro = 'Ocorreu um erro ao buscar os gerentes: ' + error.message;
        alert(this.erro);
      }
    });
  }

  setContas() {
    this.adminService.getContasList().subscribe({
      next: (contas) => {
        console.log(contas);
        this.contas = contas;
      },
      error: (error) => {
        this.erro = 'Ocorreu um erro ao buscar as contas: ' + error.message;
        alert(this.erro);
      }
    });
  }

  setClientes() {
    this.adminService.getClientesList().subscribe({
      next: (clientes) => {
        this.clientes = clientes.map((cliente) => ({
          ...cliente,
          cpf: this.formatCPF(cliente.cpf!)}));
        this.sortClientesByNameAsc(); 
      },
      error: (error) => {
        this.erro = 'Ocorreu um erro ao buscar as contas: ' + error.message;
        alert(this.erro);
      }
    });

  }
  sortClientesByNameAsc() {
    this.clientes.sort((a, b) => {
      return a.nome.localeCompare(b.nome);
    });
  }

  buscaSaldoConta(cliente: Cliente): any {

    const contaCliente = this.contas.find(conta => conta.id_cliente == cliente.id);

    return contaCliente?.saldo;

  }

  buscaLimiteConta(cliente: Cliente): number {

    const contaCliente = this.contas.find(conta => conta.id_cliente == cliente.id);

    return contaCliente?.limite!;

  }

  buscaGerenteCliente(cliente: Cliente): string {
    let cntCliente = this.contas.find(conta => conta.id_cliente == cliente.id);
    let gerente = this.gerentes.find(gerente => gerente.id == cntCliente?.gerenteId);
    return gerente?.nome!;
  }

  formatCPF(cpf: String): string {
    {
      let numbersOnly = cpf.replace(/\D/g, '');

      if (numbersOnly.length <= 3) {
        return numbersOnly;
      } else if (numbersOnly.length <= 6) {
        return `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3)}`;
      } else if (numbersOnly.length <= 9) {
        return `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6)}`;
      } else {
        return `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`;
      }
    }
  }

  formatCurrency(value: number): string {

    const formattedValue = Number(value).toFixed(2);


    const [integerPart, decimalPart] = formattedValue.split('.');

    const integerWithSeparator = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const formattedCurrency = `R$ ${integerWithSeparator},${decimalPart}`;

    return formattedCurrency;
  }


}
