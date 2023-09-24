import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent implements OnInit {
  dataInicial: string | undefined;
  dataFinal: string | undefined;
  movimentacoes: any[] = [];
  cliente!: any;
  conta!: any;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarMovimentacoes();
    
  }

  carregarMovimentacoes(): void {

    const idConta = this.clienteService.getAccontByClientId(this.cliente.id).subscribe(
      conta => {
        if (conta) {
          this.conta = conta; 
        } 
      }
      
    ); 
   
    this.clienteService.getMovimentacoesPorIdConta(idConta).subscribe(
      (movimentacoes) => {
        this.movimentacoes = movimentacoes;
      },
      (error) => {
        console.error('Erro ao carregar as movimentações:', error);
      }
    );
  }

  filtrarMovimentacoes(): void {

  }
}