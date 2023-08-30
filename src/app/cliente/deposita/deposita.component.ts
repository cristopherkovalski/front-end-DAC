import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposita',
  templateUrl: './deposita.component.html',
  styleUrls: ['./deposita.component.css']
})
export class DepositaComponent implements OnInit {

  @ViewChild('formDepositar') formDepositar!: NgForm;

  cliente!: any;
  conta!: any;
  public valorDeposito!: number;

  constructor(
    private clienteService: ClienteService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.cliente = this.clienteService.clienteLogado();
    this.clienteService.buscarContaPorClienteId(this.cliente.id).subscribe(
      conta =>{
        if(conta)
          this.conta = conta; 
        else{
          alert("Cliente Sem conta, por favor entre em contato");
          this.router.navigate(["/home-cliente"])
        }
          
          
      }
    );
    console.log(this.conta);
    // this.conta = this.clienteService.getConta();
  }

  depositar(): void {
    
    if ((this.formDepositar.form.valid) && (this.valorDeposito > 0)) {
      this.clienteService.depositar(this.valorDeposito, this.cliente.id).subscribe(
        (status:boolean) =>{

          alert( status ? 'Desposito realizado com succeso!':'Algo deu errado no deposito tente mais novamente em alguns instantes!');

          // só para att na tela a conta
          this.clienteService.buscarContaPorClienteId(this.cliente.id).subscribe(
            conta =>{
              if(conta)
                this.conta = conta; 
              else
                alert("Cliente Sem conta, por favor entre em contato");
            }
          );
          console.log(this.conta)
        }
      )
      
    }
  };
}
