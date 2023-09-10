import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SharedModule } from '../shared/directives/shared.module';
import { RelatorioClientesComponent } from './relatorio-clientes/relatorio-clientes.component';
import { InserirGerenteComponent } from './inserir-gerente/inserir-gerente.component';


@NgModule({
  declarations: [
    HomeAdminComponent,
    RelatorioClientesComponent,
    InserirGerenteComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    CurrencyMaskModule
  ]
})
export class AdminModule { }
