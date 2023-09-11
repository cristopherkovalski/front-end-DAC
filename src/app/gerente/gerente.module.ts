import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeGerenteComponent } from './home-gerente/home-gerente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';



@NgModule({
  declarations: [
    HomeGerenteComponent,
    ListaClientesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GerenteModule { }
