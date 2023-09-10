import { NgModule } from '@angular/core';
import { CepFormatDirective } from './cep-format.directive';
import { TelefoneFormatDirective } from './telefone-format.directive';
import { CpfFormatDirective } from './cpf-format.directive';

@NgModule({
  declarations: [
    CepFormatDirective,
    TelefoneFormatDirective,
    CpfFormatDirective
  ],
  exports: [
    CepFormatDirective,
    TelefoneFormatDirective,
    CpfFormatDirective
  ]
})
export class SharedModule { }