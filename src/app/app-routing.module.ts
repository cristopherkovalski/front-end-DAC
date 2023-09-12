import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';


//cliente components, gerar depois rotas em cada modulo para ficar mais limpo
import { DepositaComponent } from './cliente/deposita/deposita.component';
import { SaqueComponent } from './cliente/saque/saque.component';
import { TransfComponent } from './cliente/transf/transf.component';
import { CadastroComponent } from './cliente/cadastro/cadastro.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeClienteComponent } from './cliente/home-cliente/home-cliente.component';
import { AlteraPerfilComponent } from './cliente/altera-perfil/altera-perfil.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { InserirGerenteComponent } from './admin/inserir-gerente/inserir-gerente.component';
import { HomeGerenteComponent } from './gerente/home-gerente/home-gerente.component';
import { ListaClientesComponent } from './gerente/lista-clientes/lista-clientes.component';
import { RelatorioClientesComponent } from './admin/relatorio-clientes/relatorio-clientes.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LoginComponent },
  {path: 'login', pathMatch:'full', component :LoginComponent},
  {path: 'registrar', pathMatch: 'full', component: CadastroComponent },
  {path: 'alterarperfil', pathMatch: 'full', component: AlteraPerfilComponent },
  {path: 'depositar', pathMatch: 'full', component: DepositaComponent },
  {path: 'sacar', pathMatch: 'full', component: SaqueComponent },
  {path: 'transf', pathMatch: 'full', component: TransfComponent },
  {path: 'home-cliente', pathMatch:'full', component:HomeClienteComponent},
  {path: 'home-admin', pathMatch:'full', component:HomeAdminComponent},
  {path: 'inserir-gerente', pathMatch:'full', component:InserirGerenteComponent},
  {path: 'home-gerente', pathMatch:'full', component:HomeGerenteComponent},
  {path: 'lista-clientes', pathMatch:'full', component:ListaClientesComponent},


  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
