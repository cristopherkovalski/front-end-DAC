import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';


@Component({
  selector: 'app-saque',
  templateUrl: './saque.component.html',
  styleUrls: ['./saque.component.css']

})
export class SaqueComponent implements OnInit {
  @ViewChild('formSacar') formSacar!: NgForm;

  cliente!: any;
  conta!: any;
  public valorSaque!: string;

  constructor(
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.cliente = this.clienteService.getCliente();
    this.conta = this.clienteService.getConta();
  }

  sacar(): void {
    if (this.clienteService.saque(+this.valorSaque)) {
      alert('Saque realizado com succeso!');

    } else {
      alert('Algo deu errado durante o saque, tente mais novamente em alguns instantes!');
    }



  }
}
