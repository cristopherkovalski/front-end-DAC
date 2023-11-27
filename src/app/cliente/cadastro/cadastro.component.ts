import { Component, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { CepService } from '../services/cep.service';
import { CadastroService } from '../services/cadastro.service';
import { Router } from '@angular/router';
import { Gerente } from 'src/app/shared/models/gerente.model';




@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  @ViewChild('formCadastrar') formCadastrar!: NgForm;

  cliente: Cliente = new Cliente();
  conta: Conta = new Conta();
  gerentes: Gerente[] = [];
  gerente: Gerente = new Gerente();
  contas: Conta[] = [];
  mensagem: string = '';
  mensagemCPF: string = '';
  cpfValido: boolean = false;
  isCepSet: boolean = false;

  auth!:{};

  constructor(private cepService: CepService, private cadastroService: CadastroService, private router: Router) {

  }

  ngOnInit(): void {
    // this.setGerentesList();
  }
  
  resetarValidacaoCPF(){
    if(this.cpfValido === true)
    this.cpfValido= false;
    this.mensagemCPF = '';
  }

  setGerentesList() {
    this.cadastroService.getGerentesList().subscribe({
      next: (gerentes) => {
        this.gerentes = gerentes
      },
      error: (error) => {
        alert('Ocorreu um erro ao buscar os gerentes: ' + error.message);
      }
    });
  }

  buscarEndereco(): void {
    this.cepService.consultarCep(this.removeMascara(this.cliente.cep)).subscribe(data => {
      if (data.erro) {
        alert("CEP Inválido");
      } else {
        this.isCepSet = true;
        this.cliente.cidade = data.localidade;
        this.cliente.estado = data.uf;
        this.cliente.logradouro = data.logradouro;
        const partesLogradouro = data.logradouro.split(' ');
        if (partesLogradouro.length > 1) {
          this.cliente.tipo = partesLogradouro[0];
          this.cliente.logradouro = partesLogradouro.slice(1).join(' ');
        } else {
          this.cliente.tipo = '';
          this.cliente.logradouro = data.logradouro;
        }
      }
    },
      error => {
        alert(error);

      });
  }


  verificarCPF() {
    const cpfclean = this.removeMascara(this.cliente.cpf);

    if (cpfclean.length == 11){
      if (this.cadastroService.isValidCPF(cpfclean)) {
    
        this.cpfValido = true;
        this.mensagemCPF = "CPF Ok!";
    
      } else {

        this.cpfValido = false;
        this.cliente.cpf = '';
        this.mensagemCPF = "CPF inválido! Insira um novo CPF.";
      }
    }
  }

  encontrarGerenteComMenosContas(contas: Conta[]): Gerente | null {
    let contasPorGerente: Record<number, number> = {};
  
    contas.forEach((conta) => {
      let gerenteId = conta.gerenteId;
      if (gerenteId !== undefined) {
        if (contasPorGerente[gerenteId] === undefined) {
          contasPorGerente[gerenteId] = 1;
        } else {
          contasPorGerente[gerenteId]++;
        }
      }
    });
  
    let gerenteComMenosContas: Gerente | null = null;
    let menorQuantidadeDeContas = Infinity;
    let menorIdDoGerenteComMenosContas = Infinity;
  
    this.gerentes.forEach((gerente) => {
      let gerenteId = gerente.id;
      if (gerenteId !== undefined) {
        let quantidadeDeContas = contasPorGerente[gerenteId] || 0;
        if (quantidadeDeContas < menorQuantidadeDeContas) {
          menorQuantidadeDeContas = quantidadeDeContas;
          menorIdDoGerenteComMenosContas = gerenteId!;
          gerenteComMenosContas = gerente;
        } else if (quantidadeDeContas === menorQuantidadeDeContas && gerenteId! < menorIdDoGerenteComMenosContas) {
          menorIdDoGerenteComMenosContas = gerenteId!;
          gerenteComMenosContas = gerente;
        }
      }
    });
  
    return gerenteComMenosContas;
  }

  removeMascara(mask: string): string {
    return mask.replace(/\D/g, '');
  }


  cadastrarCliente(): void {
    if (this.formCadastrar.form.valid && this.cpfValido && this.cliente.salario >= 0) {
      this.cliente.cpf = this.removeMascara(this.cliente.cpf);
      this.cliente.cep = this.removeMascara(this.cliente.cep);
      this.cliente.telefone = this.removeMascara(this.cliente.telefone);


      class AutocadastroDTO{
        constructor(
        public id_cliente: number = 0,
        public id_gerente: number = 0,
        public saldo: number = 0,
        public limite: number = 0,
        public situacao: string = '',
        public observacao: string = '',
        public email: string = '',
        public nome: string = '',
        public senha: string = '',
        public cpf: string = '',
        public tipo: string = '',
        public logradouro: string = '',
        public numero: string = '',
        public complemento: string = '',
        public cep: string = '',
        public cidade: string = '',
        public estado: string = '',
        public telefone: string = '',
        public salario: number = 0,
        ) {}
          
      }

      let limite;
      if (this.cliente.salario >= 2000) {
        this.conta.limite = this.cliente.salario / 2;
        limite =  this.cliente.salario / 2;
      } else {
        this.conta.limite = 0;
        limite= 0;
      }

      let autocadastroDTO:AutocadastroDTO = new AutocadastroDTO(0, 0, 0, limite,
        "PENDENTE", "",this.cliente.email, this.cliente.nome, "",this.cliente.cpf, "CLIENTE",
        this.cliente.logradouro, this.cliente.numero,this.cliente.complemento,
        this.cliente.cep, this.cliente.cidade, this.cliente.estado, this.cliente.telefone, this.cliente.salario);

      this.cadastroService.insereCliente(autocadastroDTO).subscribe({
        next: (clienteResponse) => {
          alert('Cadastro efetuado com sucesso, aguarde email para confirmação de conta');
          this.router.navigate(['/']);
        },
        error: (contaError) => {
          alert('Erro ao criar a conta.');
          console.error('Erro ao criar a conta:', contaError);
        }
      });









      // this.cadastroService.getContasList().subscribe({
      //   next: (contasResponse) => {
      //     this.contas = contasResponse;
      //     this.cadastroService.insereCliente(this.cliente).subscribe({
      //       next: (clienteResponse) => {
      //         this.conta.id_cliente = clienteResponse.id;
      //         this.gerente = this.encontrarGerenteComMenosContas(this.contas!)!;
      //         this.conta.gerenteId = this.gerente.id;
      //         console.log(this.conta.gerenteId);
      //         if (this.cliente.salario >= 2000) {
      //           this.conta.limite = this.cliente.salario / 2;
      //         } else {
      //           this.conta.limite = 0;
      //         }
      //         this.conta.saldo = 0;
      //         this.conta.situacao = "PENDENTE";
      //         this.cadastroService.insereConta(this.conta).subscribe({
      //           next: (contaResponse) => {
      //             this.cadastroService.insereAuth({"id_user": clienteResponse.id,"nome": this.cliente.nome, "senha" : null, "email": this.cliente.email, "type" : "CLIENTE"}).subscribe({
      //               next: (responsse) =>{
      //                 alert('Cliente e conta criados com sucesso.');
      //                 this.router.navigate(['/']);
      //               }
      //             })
      //           },
      //           error: (contaError) => {
      //             alert('Erro ao criar a conta.');
      //             console.error('Erro ao criar a conta:', contaError);
      //           }
      //         });
      //       },
      //       error: (clienteError) => {
      //         alert('Erro ao criar o cliente.');
      //         console.error('Erro ao criar o cliente:', clienteError);
      //       },
      //     });
      //   },
      //   error: (error) => {
      //     alert("erro geral, contate admin!");
      //   }
      // });
      // this.cliente.situacao = "PENDENTE";

      this.router.navigate(['/']);
    } else {
      alert("Erro na inserção de dados, favor inserir dados corretos");
    }
  }
}






