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
    private router: Router
  ) {}

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

  depositar(): void {
    if ((this.formDepositar.form.valid) && (this.valorDeposito > 0)) {
      this.clienteService.depositar(this.valorDeposito, this.conta).subscribe({
        next:(response) =>{
          alert('Depósito realizado com sucesso!');
          console.log(response);
          this.conta.saldo = response.saldo;

          // const options:any = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
          // const transacao = {
          //   valor: this.valorDeposito,
          //   origem: this.conta.id,
          //   destino: null,
          //   dataHora: new Date().toJSON() // Hora atual em formato ISO
          // };
        },
        error:(e) => alert(e)
      })
    }
  }
}
