import { Component, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { CepService } from '../services/cep.service';
import { CadastroService } from '../services/cadastro.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  @ViewChild('formCadastrar') formCadastrar!: NgForm;

  cliente: Cliente = new Cliente();
  conta: Conta = new Conta();
  contas: Conta[] = [];
  mensagem: string = '';
  mensagemCPF: string = '';
  cpfValido: boolean = false;
  isCepSet: boolean = false;

  constructor(private cepService: CepService, private cadastroService: CadastroService, private router: Router) {

  }
  
  resetarValidacaoCPF(){
    if(this.cpfValido === true)
    this.cpfValido= false;
    this.mensagemCPF = '';
  }

  buscarEndereco(): void {
    this.cepService.consultarCep(this.removeMascara(this.cliente.endereco.cep)).subscribe(data => {
      if (data.erro) {
        alert("CEP Inválido");
      } else {
        this.isCepSet = true;
        this.cliente.endereco.cidade = data.localidade;
        this.cliente.endereco.estado = data.uf;
        this.cliente.endereco.logradouro = data.logradouro;
        const partesLogradouro = data.logradouro.split(' ');
        if (partesLogradouro.length > 1) {
          this.cliente.endereco.tipo = partesLogradouro[0];
          this.cliente.endereco.logradouro = partesLogradouro.slice(1).join(' ');
        } else {
          this.cliente.endereco.tipo = '';
          this.cliente.endereco.logradouro = data.logradouro;
        }
      }
    },
      error => {
        alert(error);

      });
  }


  verificarCPF() {
    const cpfclean = this.removeMascara(this.cliente.cpf);
    if (this.cadastroService.isValidCPF(cpfclean)) {
      this.cadastroService.checkCpf(cpfclean).subscribe((cpfExists) => {
        if (cpfExists) {
          this.cpfValido = false;
          this.cliente.cpf = '';
          this.mensagemCPF = "CPF já cadastrado! Insira um novo CPF.";
        } else {
          this.cpfValido = true;
          this.mensagemCPF = "CPF Ok!";
        }
      });
    } else {
      this.cpfValido = false;
      this.cliente.cpf = '';
      this.mensagemCPF = "CPF inválido! Insira um novo CPF.";
    }
  }

  getGerenteComMenosContas(contas?: Conta[]) {
    const contasPorGerente = new Map();

    for (let conta of contas!) {
      const gerenteId = conta.gerenteId;
      if (contasPorGerente.has(gerenteId)) {
        contasPorGerente.set(gerenteId, contasPorGerente.get(gerenteId) + 1);
      } else {
        contasPorGerente.set(gerenteId, 1);
      }
    }

    let gerenteComMenosContasId = null;
    let menorNumeroDeContas = Number.MAX_SAFE_INTEGER; // Inicializa com um valor muito grande

    contasPorGerente.forEach((numeroDeContas, gerenteId) => {
      if (numeroDeContas < menorNumeroDeContas) {
        menorNumeroDeContas = numeroDeContas;
        gerenteComMenosContasId = gerenteId;
      } else if (numeroDeContas === menorNumeroDeContas && gerenteId > gerenteComMenosContasId!) {
        // Se dois gerentes têm o mesmo número de contas, escolha o de maior ID
        gerenteComMenosContasId = gerenteId;
      }
    });

    return gerenteComMenosContasId;
  }



  removeMascara(mask: string): string {
    return mask.replace(/\D/g, '');
  }


  cadastrarCliente(): void {
    if (this.formCadastrar.form.valid && this.cpfValido && this.cliente.salario > 0) {
      this.cliente.cpf = this.removeMascara(this.cliente.cpf);
      this.cliente.endereco.cep = this.removeMascara(this.cliente.endereco.cep);
      this.cliente.telefone = this.removeMascara(this.cliente.telefone);
      this.cadastroService.getContasList().subscribe({
        next: (contasResponse) => {
          this.contas = contasResponse;
          this.cadastroService.insereCliente(this.cliente).subscribe({
            next: (clienteResponse) => {
              this.conta.id_cliente = clienteResponse.id;
              this.conta.gerenteId = this.getGerenteComMenosContas(this.contas!)!;
              if (this.cliente.salario >= 2000) {
                this.conta.limite = this.cliente.salario / 2;
              } else {
                this.conta.limite = 0;
              }
              this.conta.saldo = 0;
              this.conta.situacao = "PENDENTE";
              this.cadastroService.insereConta(this.conta).subscribe({
                next: (contaResponse) => {
                  alert('Cliente e conta criados com sucesso.');
                  this.router.navigate(['/']);
                },
                error: (contaError) => {
                  alert('Erro ao criar a conta.');
                  console.error('Erro ao criar a conta:', contaError);
                }
              });
            },
            error: (clienteError) => {
              alert('Erro ao criar o cliente.');
              console.error('Erro ao criar o cliente:', clienteError);
            },
          });
        },
        error: (error) => {
          alert("erro geral, contate admin!");
        }
      });
      // this.cliente.situacao = "PENDENTE";

      this.router.navigate(['/']);
    } else {
      alert("Erro na inserção de dados, favor inserir dados corretos");
    }
  }
}






