import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';


@NgModule({
  declarations: [
    HomeAdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CurrencyMaskModule
  ]
})
export class AdminModule { }
