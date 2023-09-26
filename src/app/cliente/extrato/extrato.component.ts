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
    this.cliente = this.clienteService.getUsuarioLogado();
    this.clienteService.getAccontByClientId(2).subscribe(
      conta => {
        if (conta) {
          this.conta = conta; 
        } 
      }
    ); 

    this.carregarMovimentacoes();
    
  }

  comparaDatas(a:any,b:any){
    let c = new Date(a.dataHora)
    let j = new Date(b.dataHora)

    return j.getTime() - c.getTime();
  }

  carregarMovimentacoes(): void {
    this.clienteService.getMovimentacoesPorIdConta("2").subscribe(
      (movimentacoes) => {
        movimentacoes.forEach((movi:any) => {
          this.movimentacoes.push(movi);
          this.movimentacoes.sort(this.comparaDatas);
        })
        console.log(this.movimentacoes)
      },
      (error) => {
        console.error('Erro ao carregar as movimentações:', error);
      }
    );

    this.clienteService.getMovimentacoesPorIdContaDestiny("2").subscribe(
      (movimentacoes) => {
        movimentacoes.forEach((movi:any) => {
          this.movimentacoes.push(movi);
          this.movimentacoes.sort(this.comparaDatas);
        })
        console.log(this.movimentacoes)
      },
      (error) => {
        console.error('Erro ao carregar as movimentações:', error);
      }
    )
  }

  filtrarMovimentacoes(): void {

    if(this.dataInicial != undefined && this.dataFinal != undefined){
      this.movimentacoes = this.movimentacoes.filter(objeto => {

        // nojo de timezones e datetime
        const dataObjeto = new Date(objeto.dataHora).getTime();
        const dataIni = new Date(this.dataInicial!+"T00:00:00.000Z").getTime();
        const dataFim = new Date(this.dataFinal!+"T23:59:59.999Z").getTime();

        return (dataObjeto >= dataIni && dataObjeto <= dataFim);
      });
    }
  }

  //const combinedArray = [...array1, ...array2];

  convertData(date:string){

    // Converter a data para um objeto Date
    const data = new Date(date);

    // Obter os componentes da data (dia, mês, ano, hora, minutos, segundos)
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Note que os meses são base 0
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');

    // Formatar a data no formato desejado
    const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

    return dataFormatada;
  }
}