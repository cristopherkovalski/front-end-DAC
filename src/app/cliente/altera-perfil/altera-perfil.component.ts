import { Component, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { NgForm } from '@angular/forms';
import { CepService } from '../services/cep.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { TelefoneFormatDirective } from 'src/app/shared/directives/telefone-format.directive';
import { CepFormatDirective } from 'src/app/shared/directives/cep-format.directive';
import { CpfFormatDirective } from 'src/app/shared/directives/cpf-format.directive';


const LS_CHAVE: string = "ususarioLogado";


@Component({
  selector: 'app-altera-perfil',
  templateUrl: './altera-perfil.component.html',
  styleUrls: ['./altera-perfil.component.css']
})
export class AlteraPerfilComponent {
  @ViewChild(TelefoneFormatDirective) telefoneFormatDirective!: TelefoneFormatDirective;
  @ViewChild(CepFormatDirective) cepFormatDirective!: CepFormatDirective; 
  @ViewChild(CpfFormatDirective) cpfFormatDirective!: CpfFormatDirective;

  cliente = new Cliente();
  mensagem: string = '';
  mensagemCPF: string = '';

  constructor(private cepService: CepService, private router: Router, private login: LoginService, private clienteService: ClienteService, ) {
  
}

ngAfterViewInit(): void {
  const clienteResult = this.clienteService.getUsuarioLogado();
  console.log(clienteResult);

  this.clienteService.buscarCliente(clienteResult.id).subscribe(
    (cliente: Cliente) => {
      this.cliente = cliente;
      setTimeout(() => {
        this.telefoneFormatDirective.formatPhone(this.cliente.telefone);
        this.cpfFormatDirective.formatCPF(this.cliente.cpf);
        this.cepFormatDirective.formatCep(this.cliente.endereco.cep);
      });
    },
    (error) => {
      console.error("Erro ao buscar cliente:", error);
    }
  );
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
  
  removeMascara(mask: string): string {
    return mask.replace(/\D/g, '');
  }


  alterarCliente(): void {
    if (this.cliente.salario >= 2000) {
      const limite = this.cliente.salario / 2;
    }
    this.cliente.cpf = this.removeMascara(this.cliente.cpf);
    this.cliente.endereco.cep = this.removeMascara(this.cliente.endereco.cep);
    this.cliente.telefone = this.removeMascara(this.cliente.telefone);
    this.clienteService.atualizarCliente(this.cliente).subscribe(
    (mensagem) => {
        alert(mensagem); // Exibe a mensagem de sucesso ou erro em um alerta
        this.router.navigate(['/home-cliente']);
      },
      (error) => {
        alert('Erro ao atualizar o cliente' + error);
      }
    );
    this.router.navigate(['/home-cliente']);
  }


}

