import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { CurrencyMaskDirective } from '../shared/directives/currency-mask.directive';
import { NumericoDirective } from '../shared/directives/numerico.directive';
import { SharedModule } from '../shared/directives/shared.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DepositaComponent } from './deposita/deposita.component';
import { SaqueComponent } from './saque/saque.component';
import { TransfComponent } from './transf/transf.component';
import { HomeClienteComponent } from './home-cliente/home-cliente.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { AlteraPerfilComponent } from './altera-perfil/altera-perfil.component';
import { HttpClientModule } from '@angular/common/http';
import { ExtratoComponent } from './extrato/extrato.component';




@NgModule({
  declarations: [
    DepositaComponent,
    NumericoDirective,
    SaqueComponent,
    TransfComponent,
    HomeClienteComponent,
    CadastroComponent,
    AlteraPerfilComponent,
    ExtratoComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    CurrencyMaskModule,
    HttpClientModule,
    NgbModule
  ]
})
export class ClienteModule { }
