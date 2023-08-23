import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';


//cliente components, gerar depois rotas em cada modulo para ficar mais limpo
import { DepositaComponent } from './cliente/deposita/deposita.component';
import { TransfComponent } from './cliente/transf/transf.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: AppComponent },
  {path: 'depositar', pathMatch: 'full', component: DepositaComponent },
  {path: 'transf', pathMatch: 'full', component: TransfComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
