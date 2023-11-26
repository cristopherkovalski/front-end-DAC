import { Component, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { CepService } from '../services/cep.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { TelefoneFormatDirective } from 'src/app/shared/directives/telefone-format.directive';
import { CepFormatDirective } from 'src/app/shared/directives/cep-format.directive';
import { CpfFormatDirective } from 'src/app/shared/directives/cpf-format.directive';
import { Usuario } from 'src/app/shared/models/usuario.model';


const LS_CHAVE: string = "ususarioLogado";


@Component({
  selector: 'app-altera-perfil',
  templateUrl: './altera-perfil.component.html',
  styleUrls: ['./altera-perfil.component.css']
})
export class AlteraPerfilComponent{
  @ViewChild(TelefoneFormatDirective) telefoneFormatDirective!: TelefoneFormatDirective;
  @ViewChild(CepFormatDirective) cepFormatDirective!: CepFormatDirective; 
  @ViewChild(CpfFormatDirective) cpfFormatDirective!: CpfFormatDirective;
  @ViewChild('formAlterar') formAlterar!: NgForm;


  cliente = new Cliente();
  mensagem: string = '';
  mensagemCPF: string = '';

  constructor(private cepService: CepService, private router: Router, private login: LoginService, private clienteService: ClienteService, ) {
  
}


ngAfterViewInit(): void {

  const clienteResult = this.clienteService.getUsuarioLogado();
  console.log(clienteResult);

  this.clienteService.buscarCliente(clienteResult.id_user).subscribe(
    (cliente: Cliente) => {  
      console.log(cliente)
      this.cliente = cliente;
      setTimeout(() => {
        this.cliente.telefone = this.telefoneFormatDirective.formatPhone(this.cliente.telefone);
        this.cliente.cpf = this.cpfFormatDirective.formatCPF(this.cliente.cpf);
        this.cliente.cep = this.cepFormatDirective.formatCep(this.cliente.cep);
      });
    },
    (error) => {
      console.error("Erro ao buscar cliente:", error);
    }
  );
}


  buscarEndereco(): void {
    this.cepService.consultarCep(this.removeMascara(this.cliente.cep)).subscribe(data => {
      if (data.erro) {
        alert("CEP Inválido");
      } else {
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
  
  removeMascara(mask: string): string {
    return mask.replace(/\D/g, '');
  }


  alterarCliente(): void {
    if (this.formAlterar.form.valid && this.cliente.salario >= 0) {

      let limite = 0;

      if (this.cliente.salario >= 2000) {
        limite = this.cliente.salario / 2;
      }
      this.cliente.cpf = this.removeMascara(this.cliente.cpf);
      this.cliente.cep = this.removeMascara(this.cliente.cep);
      this.cliente.telefone = this.removeMascara(this.cliente.telefone);

      class ClienteDTO{
        constructor(
        public id: number = 0,
        public nome: string = '',
        public email: string = '',
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
        public limite: number = 0,
        ) {}
          
      }
  
      let clienteDTO:ClienteDTO = new ClienteDTO(this.cliente.id, this.cliente.nome, this.cliente.email, this.cliente.cpf,
        this.cliente.tipo, this.cliente.logradouro,this.cliente.numero, this.cliente.complemento,
        this.cliente.cep, this.cliente.cidade, this.cliente.estado, this.cliente.telefone, this.cliente.salario, limite);


      this.clienteService.atualizarCliente(clienteDTO).subscribe(
        (retorno) => {
          // alert(mensagem);
          // this.login.usuarioLogado = new Usuario(retorno.id_user, retorno.nome, retorno.senha, retorno.email, retorno.type);
          alert("Dados atualizados com sucesso");
          this.router.navigate(['/home-cliente']);
        },
        (error) => {
          alert('Erro ao atualizar o cliente' + error);
        }
      );
      this.router.navigate(['/home-cliente']);
    } else {
      alert('Inserir dados válidos');
    }
  }


}

