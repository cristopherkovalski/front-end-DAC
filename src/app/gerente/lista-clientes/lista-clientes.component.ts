import { Component, OnInit } from '@angular/core';
import { GerenteService } from '../services/gerente.service';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { ClienteService } from 'src/app/cliente/services/cliente.service';


@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {


  constructor(private gerenteService:GerenteService, private clienteService:ClienteService){}

  loading:boolean = false;
  clientes: Cliente[] = [];
  contas: Conta[] = [];
  gerente !: Usuario;
  clientesFiltrados: Cliente[] = []; // Array para armazenar os clientes filtrados
  consulta: string = ''; // A consulta de pesquisa inserida pelo usuário

  ngOnInit(): void {
    
    this.gerente = this.gerenteService.gerenteLogado();
    this.clientes = [];
    this.contas = [];
    this.listarTodos();
    // this.listarTodosC();
    // this.filtrarClientes();
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
                this.clientesFiltrados = this.clientes.sort((a, b) => a.nome.localeCompare(b.nome));
              }
            });
          });
        }
      },
      complete:()=>{this.loading = false;}
    });

    
  }

  // listarTodosC(): Conta[] {
  //   this.gerenteService.listarTodosContas().subscribe({
  //     next: (data: Conta[]) => {
  //       if (data == null) {
  //         this.clientes = [];
  //       }
  //       else {
  //         this.contas = data;
  //       }
  //     }
  //   });
  //   return this.contas;
  // }

  buscaSaldoConta(cliente: Cliente): any{
    const clienteT = this.contas.filter(conta => conta.id_cliente == cliente.id).at(0)
    return clienteT
    
  }
  // Função para filtrar os clientes com base na consulta
  filtrarClientes() {
    this.clientesFiltrados = this.clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(this.consulta.toLowerCase()) ||
        cliente.cpf.includes(this.consulta)
    );

  }

}




