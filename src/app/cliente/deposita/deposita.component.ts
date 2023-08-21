import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-deposita',
  templateUrl: './deposita.component.html',
  styleUrls: ['./deposita.component.css']
})
export class DepositaComponent implements OnInit {

  @ViewChild('formDepositar') formDepositar!: NgForm;

  cliente!: any;
  conta!: any;
  public valorDeposito!: string;

  constructor(
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.cliente = this.clienteService.getCliente();
    this.conta = this.clienteService.getConta();
  }

  depositar(): void {

    let value = this.convertValue(this.valorDeposito);
    console.log(value)
    
    /*if ((this.formDepositar.form.valid) && ( value > 0)) {
      if(this.clienteService.depositar(value)){
        alert('Desposito realizado com succeso!');

        //pegando  a conta att só para visualizar
        this.conta = this.clienteService.getConta()

        //retornar a home com navigate

      }else{
        alert('Algo deu errado no deposito tente mais novamente em alguns instantes!');
      }

      
    } */
  };

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
