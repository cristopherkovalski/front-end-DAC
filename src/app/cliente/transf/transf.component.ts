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
  contaDestinoId: number | undefined;
  
  public valorTransferencia!: number;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cliente = this.clienteService.getUsuarioLogado();
    this.clienteService.getAccontByClientId(this.cliente.id).subscribe(
      conta => {
        if (conta) {
          this.conta = conta; 
        } 
      }
    );
  }

  transferir(): void {
    if (this.formDepositar.form.valid) {
      const valor = this.valorTransferencia;
  
      if (valor > 0 && valor <= this.conta.saldo && this.contaDestinoId) {
        // Obtenha a conta de destino pelo ID
        this.clienteService.getAccontByClientId(this.contaDestinoId).subscribe((contaDestino) => {
          if (contaDestino) {
            // Realize a transferência
            this.clienteService.transfere(valor, this.conta, contaDestino).subscribe(() => {
              alert('Transferência realizada com sucesso!');
              // Atualize as referências locais
              this.conta = this.clienteService.getAccontByClientId(this.cliente.id).subscribe(
                conta => {
                  if (conta) {
                    this.conta = conta; 
                  } 
                }
              );
            }, (error) => {
              alert('Erro ao realizar a transferência: ' + error);
            });
          } else {
            alert('Conta de destino não encontrada.');
          }
        });
      } else {
        alert('Saldo insuficiente para a transferência ou valor inválido.');
      }
    } else {
      alert('Preencha um valor de transferência válido.');
    }
  }

  isValidValue(): boolean{
    if (this.valorTransferencia > this.conta.saldo){
       return false;
      }else{
       return true;
      }
  }
  
}
