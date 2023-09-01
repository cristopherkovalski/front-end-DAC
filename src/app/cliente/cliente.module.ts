import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { CurrencyMaskDirective } from '../shared/directives/currency-mask.directive';
import { NumericoDirective } from '../shared/directives/numerico.directive';
import { CpfFormatDirective } from '../shared/directives/cpf-format.directive';
import { TelefoneFormatDirective } from '../shared/directives/telefone-format.directive';
import { CepFormatDirective } from '../shared/directives/cep-format.directive';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DepositaComponent } from './deposita/deposita.component';
import { SaqueComponent } from './saque/saque.component';
import { TransfComponent } from './transf/transf.component';
import { HomeClienteComponent } from './home-cliente/home-cliente.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [
    DepositaComponent,
    NumericoDirective,
    SaqueComponent,
    TransfComponent,
    HomeClienteComponent,
    CadastroComponent,
    CpfFormatDirective,
    TelefoneFormatDirective,
    CepFormatDirective

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CurrencyMaskModule,
    HttpClientModule
  ]
})
export class ClienteModule { }
