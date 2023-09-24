import { Component } from '@angular/core';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent {
  dataInicial: string | undefined;
  dataFinal: string | undefined;

  onSubmit() {
    // Aqui você pode acessar os valores de dataInicial e dataFinal
    console.log('Data Inicial:', this.dataInicial);
    console.log('Data Final:', this.dataFinal);

    // Faça o que quiser com os valores, como enviar para um serviço ou realizar a lógica desejada.
  }
}
