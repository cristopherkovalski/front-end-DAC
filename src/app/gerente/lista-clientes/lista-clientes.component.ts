import { Component, OnInit } from '@angular/core';
import { GerenteService } from '../services/gerente.service';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Usuario } from 'src/app/shared/models/usuario.model';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {

  constructor(private gerenteService:GerenteService){}

  clientes: Cliente[] = [];
  gerente !: Usuario;


  ngOnInit(): void {
    this.gerente = this.gerenteService.gerenteLogado();
    this.clientes = [];
    this.listarTodos();

  }


  listarTodos(): Cliente[] {
    this.gerenteService.listarTodos().subscribe({
      next: (data: Cliente[]) => {
        if (data == null) {
          this.clientes = [];
        }
        else {
          this.clientes = data;
        }
      }
    });
    return this.clientes;
  }


}