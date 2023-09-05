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
    this.cliente = this.clienteService.clienteLogado();
    this.clienteService.getAccontByClientId(this.cliente.id).subscribe(
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

  sacar(): void {
    this.clienteService.sacar(+this.valorSaque, this.conta).subscribe({
      next: (response) => {
        alert('Depósito realizado com sucesso!');
        this.conta = response;
      },
      error: (e) => alert(e)
    })
  }


}

