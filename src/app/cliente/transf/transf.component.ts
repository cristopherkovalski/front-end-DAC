import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-transf',
  templateUrl: './transf.component.html',
  styleUrls: ['./transf.component.css']
})
export class TransfComponent implements OnInit {


  @ViewChild('formDepositar') formDepositar!: NgForm;

  cliente!: any;
  conta!: any;
  
  cliente1!: any;
  conta1!: any;
  
  public valorDeposito!: string;

  constructor(
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.cliente = this.clienteService.getCliente();
    this.conta = this.clienteService.getConta();
  
    this.cliente1 = this.clienteService.getCliente1();
    this.conta1 = this.clienteService.getConta1();
  }
  

  transferir(): void {
    if (this.formDepositar.form.valid && +this.valorDeposito > 0) {
      const valor = +this.valorDeposito;

      if (valor <= this.conta.saldo) {
        this.conta.saldo -= valor;
        this.conta1.saldo += valor;

        this.clienteService.tranfere(this.conta);
        this.clienteService.tranfere(this.conta1);

        alert('Transferência realizada com sucesso!');

        // Atualizar as referências locais
        this.conta = this.clienteService.getConta();
        this.conta1 = this.clienteService.getConta1();

        // Redirecionar para a home usando o router do Angular, se você estiver usando um.
      } else {
        alert('Saldo insuficiente para a transferência.');
      }
    } else {
      alert('Preencha o valor de transferência válido.');
    }
  }

  convertValue(value:string){
    console.log(value)
    // Remove o símbolo de moeda e espaços em branco
    let numericValueString = value.replace(/[^\d,.-]/g, '');

    // Substitui a vírgula por ponto para formatar como float
    let numericValueFloat = parseFloat(numericValueString.replace(',', '.'));

    console.log(numericValueFloat); // Saída: 1.23
    return numericValueFloat

    //console.log(parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')))
   // return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
  }


}
