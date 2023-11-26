import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saque',
  templateUrl: './saque.component.html',
  styleUrls: ['./saque.component.css']

})
export class SaqueComponent implements OnInit {

  @ViewChild('formSacar') formSacar!: NgForm;

  cliente!: any;
  conta!: any;
  public valorSaque!: number;

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cliente = this.clienteService.getUsuarioLogado();
    this.clienteService.getAccontByClientId(this.cliente.id_user).subscribe(
      conta => {
        if (conta) {
          this.conta = conta; 
        } else {
          alert("Cliente Sem conta, por favor entre em contato");
          this.router.navigate(["/home-cliente"])
        }
      }
    );
  }

  isValidValue(): boolean{
    if (this.valorSaque > this.conta.saldo){
       return false;
      }else{
       return true;
      }
  }

  sacar(): void {
    if ((this.formSacar.form.valid) && (this.valorSaque > 0) && (this.valorSaque <= this.conta.saldo)){
    this.clienteService.sacar(+this.valorSaque, this.conta).subscribe({
      next: (response) => {
        alert('Saque realizado com sucesso!');
        this.conta.saldo = response.saldo;
      },
      error: (e) => alert(e)
    })
  }else{
    alert('Valor Inválido');
  }
  }


}

