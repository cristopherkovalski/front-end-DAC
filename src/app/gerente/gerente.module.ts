import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeGerenteComponent } from './home-gerente/home-gerente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DetalheClienteComponent } from './detalhe-cliente/detalhe-cliente.component';



@NgModule({
  declarations: [
    HomeGerenteComponent,
    ListaClientesComponent,
    DetalheClienteComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class GerenteModule { }
