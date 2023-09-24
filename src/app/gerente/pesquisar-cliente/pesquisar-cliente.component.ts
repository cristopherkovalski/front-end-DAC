import { Component, OnInit } from '@angular/core';
import { GerenteService } from '../services/gerente.service';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { ClienteService } from 'src/app/cliente/services/cliente.service';


@Component({
  selector: 'app-pesquisar-cliente',
  templateUrl: './pesquisar-cliente.component.html',
  styleUrls: ['./pesquisar-cliente.component.css']
})
export class PesquisarClienteComponent implements OnInit {


  constructor(private gerenteService:GerenteService, private clienteService:ClienteService){}

  clientes: Cliente[] = [];
  contas: Conta[] = [];
  gerente !: Usuario;
  consulta: string = ''; // A consulta de pesquisa inserida pelo usuário
  
  ngOnInit(): void {
    this.gerente = this.gerenteService.gerenteLogado();
    this.clientes = [];
    this.contas = [];
    this.listarTodosC();

  }


  listarTodos(): void {
    this.gerenteService.listarTodosClientes().subscribe({
      next: (data: Cliente[]) => {
        if (data == null) {
          this.clientes = [];
        } else {
          // Filtrar os clientes com base na consulta e na regra do gerente
          this.clientes = data.filter((cliente) =>
            cliente.nome.toLowerCase().includes(this.consulta.toLowerCase()) ||
            cliente.cpf.includes(this.consulta)
          ).filter((cliente) =>
            this.contas.some((conta) => conta.id_cliente == cliente.id && conta.gerenteId == this.gerente.id)
          );
        }
      }
    });
  }
  

  listarTodosC(): Conta[] {
    this.gerenteService.listarTodosContas().subscribe({
      next: (data: Conta[]) => {
        if (data == null) {
          this.clientes = [];
        }
        else {
          this.contas = data;
        }
      }
    });
    return this.contas;
  }

  buscaSaldoConta(cliente: Cliente): any{
    const clienteT = this.contas.filter(conta => conta.id_cliente == cliente.id).at(0)
    return clienteT
    
  }

  
  // Função para filtrar os clientes com base na consulta
  filtrarClientes() {
    this.clientes = this.clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(this.consulta.toLowerCase()) ||
        cliente.cpf.includes(this.consulta)
    );
  }

}




