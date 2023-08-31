import { Component } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { NgForm } from '@angular/forms';
import { CepService } from '../services/cep.service';
import { CadastroService } from '../services/cadastro.service';



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

  constructor(private cepService: CepService, private cadastroService: CadastroService) {

  }

  buscarEndereco(): void {
    this.cepService.consultarCep(this.cliente.endereco.cep).subscribe(data => {
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
    },
      error => {
        alert(error);

      });
  }
  /* applyCPFFormat(event: any): void {
     const input = event.target.value;
     let numbersOnly = input.replace(/\D/g, ''); 
   
     if (numbersOnly.length > 11) {
       numbersOnly = numbersOnly.slice(0, 11);
     }
   
     if (numbersOnly.length <= 3) {
       this.cliente.cpf = numbersOnly;
     } else if (numbersOnly.length <= 6) {
       this.cliente.cpf = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3)}`;
     } else if (numbersOnly.length <= 9) {
       this.cliente.cpf = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6)}`;
     } else {
       this.cliente.cpf = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`;
     }
   }
   
   applyTelefoneFormat(event: any): void {
     const input = event.target.value;
     let numbersOnly = input.replace(/\D/g, ''); 
     const maxDigits = 11; 
 
     if (numbersOnly.length > maxDigits) {
       numbersOnly = numbersOnly.slice(0, maxDigits);
     }
 
     if (numbersOnly.length <= 2) {
       this.cliente.telefone = `(${numbersOnly}`;
     } else if (numbersOnly.length <= 7) {
       this.cliente.telefone = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
     } else {
       this.cliente.telefone = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7)}`;
     }
   }
   */

  /*applyCEPFormat(event: any): void {
    const input = event.target.value;
    let numbersOnly = input.replace(/\D/g, ''); 
    const maxDigits = 8; // Máximo de dígitos permitidos para um CEP

    if (numbersOnly.length > maxDigits) {
      numbersOnly = numbersOnly.slice(0, maxDigits);
    }

    this.cliente.endereco.cep = numbersOnly.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }*/

  verificarCPF() {
    const cpfclean = this.removeMascara(this.cliente.cpf);
    if (this.cadastroService.isValidCPF(cpfclean)) {
      this.cpfValido = true;
    } else {
      this.cpfValido = false;
      this.cliente.cpf = '';
      this.mensagemCPF = "CPF inválido. Insira um novo CPF.";
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
    this.cadastroService.insereCliente(this.cliente);
    this.mensagem = 'Solicitação enviada. Aguardando aprovação.';
  }

}



