import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { CurrencyMaskDirective } from '../shared/directives/currency-mask.directive';
import { NumericoDirective } from '../shared/directives/numerico.directive';

import {CurrencyMaskModule } from "ng2-currency-mask";

import { DepositaComponent } from './deposita/deposita.component';
import { SaqueComponent } from './saque/saque.component';
import { TransfComponent } from './transf/transf.component';
import { HomeClienteComponent } from './home-cliente/home-cliente.component';


@NgModule({
  declarations: [
    DepositaComponent,
    NumericoDirective,
    SaqueComponent,
    TransfComponent,
    HomeClienteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CurrencyMaskModule 
  ]
})
export class ClienteModule { }
