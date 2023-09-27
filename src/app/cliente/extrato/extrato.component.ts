import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styles: [
		`
			.dp-hidden {
				width: 0;
				margin: 0;
				border: none;
				padding: 0;
			}
			.custom-day {
				text-align: center;
				padding: 0.185rem 0.25rem;
				display: inline-block;
				height: 2rem;
				width: 2rem;
			}
			.custom-day.focused {
				background-color: #e6e6e6;
			}
			.custom-day.range,
			.custom-day:hover {
				background-color: rgb(2, 117, 216);
				color: white;
			}
			.custom-day.faded {
				background-color: rgba(2, 117, 216, 0.5);
			}
		`,
	],
})
export class ExtratoComponent implements OnInit {
  // dataInicial: string | undefined;
  // dataFinal: string | undefined;
  movimentacoes: any[] = [];
  cliente!: any;
  conta!: any;
 
  // datepicker
  hoveredDate: NgbDate | null = null;

	dataInicial!: NgbDate | null;
	dataFinal!: NgbDate | null;

  hj:Date = new Date();

  maxDate: NgbDate = new NgbDate(this.hj.getFullYear(),this.hj.getMonth() + 1, this.hj.getDate());

  readonly DELIMITER = '/';

  saldosConsolidados!: any[]; 

  constructor(private clienteService: ClienteService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {}
  
 
  ngOnInit(): void {
    this.cliente = this.clienteService.getUsuarioLogado();
    // console.log(this.cliente)
    this.clienteService.getAccontByClientId(this.cliente.id).subscribe(
      conta => {
        if (conta) {
          this.conta = conta; 
        } 
      }
    ); 
  }

  parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
	}

  onDateSelection(date: NgbDate) {
		if (!this.dataInicial && !this.dataFinal) {
			this.dataInicial = date;
		} else if (this.dataInicial && !this.dataFinal && date && date.after(this.dataInicial)) {
			this.dataFinal = date;
		} else {
			this.dataFinal = null;
			this.dataInicial = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.dataInicial && !this.dataFinal && this.hoveredDate && date.after(this.dataInicial) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.dataFinal && date.after(this.dataInicial) && date.before(this.dataFinal);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.dataInicial) ||
			(this.dataFinal && date.equals(this.dataFinal)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

  comparaDatas(a:any,b:any){
    let c = new Date(a.dataHora)
    let j = new Date(b.dataHora)

    return j.getTime() - c.getTime();
  }

  comparaDatasOrdernado(a:any,b:any){
    let c = new Date(a.dataHora)
    let j = new Date(b.dataHora)

    return c.getTime() - j.getTime();
  }

  calculaSaldoConsolidado(movimentacao:any){
    let saldoPorDia:any = {};
    
    // Inicialize o saldo para a data inicial

    const dataIni = new Date(this.dataInicial!.year,this.dataInicial!.month - 1, this.dataInicial!.day, 0,0,0);
    const dataFim = new Date(this.dataFinal!.year,this.dataFinal!.month - 1, this.dataFinal!.day, 23,59,59);

    saldoPorDia[dataIni.toISOString().split("T")[0]] = 0;

    for (const movi of movimentacao) {
      const dataMovimento = new Date(movi.dataHora);
      const dataMovimentoString = dataMovimento.toISOString().split("T")[0];

      // Verifique se a data da movimentação está dentro do intervalo desejado
      if (dataMovimento >= dataIni && dataMovimento <= dataFim) {
          saldoPorDia[dataMovimentoString] = movi.saldo_final;
      }
    }

    // Preencha os dias em que não houve movimentação com o último saldo disponível
    let ultimoSaldo = 0;
    for (let data = new Date(dataIni); data <= dataFim; data.setDate(data.getDate() + 1)) {
      const dataString = data.toISOString().split("T")[0];
      if (saldoPorDia[dataString] !== undefined) {
          ultimoSaldo = saldoPorDia[dataString];
      } else {
          saldoPorDia[dataString] = ultimoSaldo;
      }
    }

    const keys: string[] = Object.keys(saldoPorDia);

    let final = [];
    for (const key of keys) {
      let b = key.split("-")
      let c = b[2] + "/"+ b[1] +"/" + b[0];
      let a = {"dataHora": c, "saldo":saldoPorDia[key]}
      final.push(a)
    }

    final = final.sort(this.compararDatas)

    return final;
  }

  compararDatas(a:any, b:any) {
    let c = a.dataHora.split("/")
    let d = b.dataHora.split("/")

    const dataA = new Date(c[2], c[1] - 1, c[0]);
    const dataB = new Date(d[2], d[1] - 1, d[0]);
  
    if (dataA < dataB) {
      return -1;
    }
    if (dataA > dataB) {
      return 1;
    }
    return 0;
  }
  
  carregarMovimentacoes(): void {
    let moviFiltradas:any = [];

    this.clienteService.getMovimentacoesPorIdConta(this.conta.id).subscribe(
      (result)=>{
        if(result){
          // console.log(result)
          result.forEach((movi:any) =>{
            // console.log(movi)
            movi.forEach((m:any) =>{
              moviFiltradas.push(m)
              moviFiltradas.sort(this.comparaDatas)
            })
          })
        }
        
      },
      (error) => {
        console.error('Erro:', error);
      },
      () => {
        this.movimentacoes = this.filtrarMovimentacoes(moviFiltradas);
        console.log(this.movimentacoes)
        this.saldosConsolidados = this.calculaSaldoConsolidado(this.filtrarMovimentacoes(moviFiltradas.sort(this.comparaDatasOrdernado)));
        
      }
    )

  }

  filtrarMovimentacoes(movimentacoes:any): [] {
    let movis = [];
   
    if(this.dataInicial != undefined && this.dataFinal != undefined){
        movis = movimentacoes.filter((objeto:any) => {

        const dataIni = new Date(this.dataInicial!.year,this.dataInicial!.month - 1, this.dataInicial!.day, 0,0,0).getTime();
        const dataFim = new Date(this.dataFinal!.year,this.dataFinal!.month - 1, this.dataFinal!.day, 23,59,59).getTime();
        const dataObjeto = new Date(objeto.dataHora).getTime();

        return (dataObjeto >= dataIni && dataObjeto <= dataFim);
      });
    }
    return movis;
  }


  validaEntradaSaida(movimentacao:any):string{
    //'table-danger' : 'table-primary'

    if(movimentacao.type === "SAQUE" || (movimentacao.type === "TRANSFERENCIA" && !movimentacao.recebido) ){
      return "table-danger";
    }

    if(movimentacao.type === "DEPOSITO" || (movimentacao.type === "TRANSFERENCIA" && movimentacao.recebido) ){
      return "table-primary";
    }

    return "";

  }


  convertData(date:string){
    let data = new Date(date);

    let dia = data.getDate().toString()
    let mes = (data.getMonth() + 1).toString()
    let ano = data.getFullYear();
    let hora = data.getHours().toString()
    let minutos = data.getMinutes().toString()
    let segundos = data.getSeconds().toString()

    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;;
  }
}