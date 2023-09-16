import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeGerenteComponent } from './home-gerente/home-gerente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HomeGerenteComponent,
    ListaClientesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class GerenteModule { }
