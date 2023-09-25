import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { GerenteService } from '../services/gerente.service';
import { ClienteService } from 'src/app/cliente/services/cliente.service';
import { Conta } from 'src/app/shared/models/conta.model';

@Component({
  selector: 'app-melhores-clientes',
  templateUrl: './melhores-clientes.component.html',
  styleUrls: ['./melhores-clientes.component.css']
})
export class MelhoresClientesComponent implements OnInit {


  constructor(private gerenteService:GerenteService, private clienteService:ClienteService){}

  loading:boolean = false;
  clientes: Cliente[] = [];
  contas: Conta[] = [];
  gerente !: Usuario;
  clientesFiltrados: Cliente[] = []; // Array para armazenar os clientes filtrados
  consulta: string = ''; // A consulta de pesquisa inserida pelo usuário
  
  ngOnInit(): void {
    this.gerente = this.gerenteService.gerenteLogado();
    // this.clientes = [];
    this.contas = [];
    this.listarTodos();
    this.listarTodosC();
  }


  listarTodos(): void {
    this.loading = true;
    this.gerenteService.listarTodosClientes().subscribe({
      next: (data: Cliente[]) => {
        if (data == null) {
          this.clientes = [];
        } else {
          data.forEach((cliente) => {
            this.clienteService.getAccontByClientId(cliente.id).subscribe((conta) => {
              this.contas.push(conta);
              if (conta.gerenteId == this.gerente.id) {
                this.clientes.push(cliente);
                this.filtrarClientesPorSaldo();
              }
            });
          });
        }
      },
    complete: ()=>{this.loading = false;}
      
    });
    

    // return this.clientes.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  listarTodosC(): Conta[] {
    this.gerenteService.listarTodosContas().subscribe({
      next: (data: Conta[]) => {
        if (data == null) {
          this.clientes = [];
        }
        else {
          this.contas = data;
          // this.filtrarClientesPorSaldo();
        }
      }
    });
    return this.contas;
  }

  buscaSaldoConta(cliente: Cliente): any{
    const clienteT = this.contas.filter(conta => conta.id_cliente == cliente.id).at(0)
    return clienteT
    
  }


  filtrarClientesPorSaldo() {
    this.clientesFiltrados = this.clientes
      .filter((cliente) => this.contas.some((conta) => conta.id_cliente === cliente.id))
      .sort((a, b) => {
        const saldoA = this.buscaSaldoConta(a)?.saldo || 0;
        const saldoB = this.buscaSaldoConta(b)?.saldo || 0;
  
        if (saldoA >= 0 && saldoB >= 0) {
          return saldoB - saldoA; 
        } else if (saldoA < 0 && saldoB < 0) {
          return saldoA - saldoB; 
        } else {
          return saldoA < saldoB ? 1 : -1; 
        }
      })
      .slice(0, 3); 
  }






}