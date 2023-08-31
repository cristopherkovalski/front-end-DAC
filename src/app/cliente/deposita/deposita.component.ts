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
    this.cliente = this.clienteService.clienteLogado();
    this.clienteService.buscarContaPorClienteId(this.cliente.id).subscribe(
      conta => {
        if (conta) {
          this.conta = conta; 
        } else {
          alert("Cliente Sem conta, por favor entre em contato");
          this.router.navigate(["/home-cliente"])
        }
      }
    );
    console.log(this.conta);
  }

 // ...
depositar(): void {
  if ((this.formDepositar.form.valid) && (this.valorDeposito > 0)) {
    this.clienteService.depositar(this.valorDeposito, this.cliente.id).subscribe(
      (status: boolean) => {
        alert(status ? 'Depósito realizado com sucesso!' : 'Algo deu errado no depósito, tente novamente em alguns instantes!');

        if (status) {
          const transacao = {
            valor: this.valorDeposito,
            origem: this.conta.id,
            destino: null,
            dataHora: new Date().toISOString() // Hora atual em formato ISO
          };

          // Chame a função para registrar a transação
          this.registrarTransacao(transacao);

          // Restante do código...
        }
      }
    );
  }
}

registrarTransacao(transacao: any): void {
  this.clienteService.registrarTransacao(
    'DEPOSITO', // Tipo da transação
    transacao.valor,
    this.conta.id, // Conta de origem
    null // Não há conta de destino para depósito
  );
}
// ...

}
