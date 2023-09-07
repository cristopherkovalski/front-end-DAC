import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteModule } from './cliente/cliente.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { GerenteModule } from './gerente/gerente.module';




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ClienteModule,
    AdminModule,
    GerenteModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
