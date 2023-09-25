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

  loading:boolean = false;
  clientes!: Cliente[];
  contas: Conta[] = [];
  gerente !: Usuario; // pq não usou o model de gerente ??
  consulta: string = ''; // A consulta de pesquisa inserida pelo usuário
  
  ngOnInit(): void {
    this.gerente = this.gerenteService.gerenteLogado();
    this.contas = [];
    this.listarTodosC();
    // this.listarTodos();
  }


  listarTodos(): void {
    this.loading = true;
    this.gerenteService.listarTodosClientes().subscribe({
      next: (data: Cliente[]) => {
        if (data == null) {
          this.clientes = [];
        } else {
          // Filtrar os clientes com base na consulta e na regra do gerente
          this.clientes = data.filter((cliente) =>
            cliente.cpf == this.removeMascara(this.consulta)
          ).filter((cliente) =>
            this.contas.some((conta) => conta.id_cliente == cliente.id && conta.gerenteId == this.gerente.id)
          );
        }
      }
    });
    this.loading = false;
  }

  removeMascara(mask: string): string {
    return mask.replace(/\D/g, '');
  }
  

  listarTodosC(): Conta[] {
    this.gerenteService.listarTodosContas().subscribe({
      next: (data: Conta[]) => {
        if (data == null) {
          this.clientes = [];
          console.log("kaa")
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

  


}




