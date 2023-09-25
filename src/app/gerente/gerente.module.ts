import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeGerenteComponent } from './home-gerente/home-gerente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DetalheClienteComponent } from './detalhe-cliente/detalhe-cliente.component';
import { PesquisarClienteComponent } from './pesquisar-cliente/pesquisar-cliente.component';
import { MelhoresClientesComponent } from './melhores-clientes/melhores-clientes.component';
import { SharedModule } from '../shared/directives/shared.module';



@NgModule({
  declarations: [
    HomeGerenteComponent,
    ListaClientesComponent,
    DetalheClienteComponent,
    PesquisarClienteComponent,
    MelhoresClientesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule
  ]
})
export class GerenteModule { }
