import { Component } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { NgForm } from '@angular/forms';
import { CepService } from '../services/cep.service';
import { CadastroService } from '../services/cadastro.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  cliente: Cliente = new Cliente();
  mensagem: string = '';
  mensagemCPF: string = '';
  cpfValido: boolean = true;

  constructor(private cepService: CepService, private cadastroService: CadastroService, private router: Router) {

  }



  buscarEndereco(): void {
    this.cepService.consultarCep(this.removeMascara(this.cliente.endereco.cep)).subscribe(data => {
      if (data.erro) {
        alert("CEP Inválido");
      } else {
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
      this.mensagemCPF = "CPF inválido! Insira um novo CPF";
    }
  }




  removeMascara(mask: string): string {
    return mask.replace(/\D/g, '');
  }


  cadastrarCliente(): void {
    if (this.cliente.salario >= 2000) {
      const limite = this.cliente.salario / 2;
    }
    this.cliente.cpf = this.removeMascara(this.cliente.cpf);
    this.cliente.endereco.cep = this.removeMascara(this.cliente.endereco.cep);
    this.cliente.telefone = this.removeMascara(this.cliente.telefone);
    this.cliente.situacao = "PENDENTE";
    this.cadastroService.insereCliente(this.cliente);
    this.cadastroService.insereCliente(this.cliente).subscribe(
      (response) => {
        alert('Solicitação enviada. Aguardando aprovação.');
        this.router.navigate(['/']);
      },
      (error) => {
       alert('Ocorreu um erro ao cadastrar o cliente:' + error);
      }
    );
    this.router.navigate(['/']);
  }


}






