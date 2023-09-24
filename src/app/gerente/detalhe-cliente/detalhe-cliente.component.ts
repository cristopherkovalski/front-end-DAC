import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { GerenteService } from '../services/gerente.service';
import { ClienteService } from 'src/app/cliente/services/cliente.service';
import { Conta } from 'src/app/shared/models/conta.model';
import { Usuario } from 'src/app/shared/models/usuario.model';

@Component({
  selector: 'app-detalhe-cliente',
  templateUrl: './detalhe-cliente.component.html',
  styleUrls: ['./detalhe-cliente.component.css']
})
export class DetalheClienteComponent implements OnInit {
  cliente: Cliente | undefined;

  constructor(private gerenteService:GerenteService, private clienteService:ClienteService, private route: ActivatedRoute) {}

  clientes: Cliente[] = [];
  contas: Conta[] = [];
  gerente !: Usuario;

  ngOnInit(): void {
    this.gerente = this.gerenteService.gerenteLogado();
    this.route.params.subscribe(params => {
      const clienteId = params['id'];
      this.clienteService.buscarCliente(clienteId).subscribe((cliente: Cliente) => {
        this.cliente = cliente;
        console.log(cliente)
      });
    });
    this.listarTodosC();

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
  

}
