import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CurrencyMaskDirective } from '../shared/directives/currency-mask.directive';
import { NumericoDirective } from '../shared/directives/numerico.directive';

import { DepositaComponent } from './deposita/deposita.component';


@NgModule({
  declarations: [
    DepositaComponent,
    NumericoDirective,
    CurrencyMaskDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class ClienteModule { }
