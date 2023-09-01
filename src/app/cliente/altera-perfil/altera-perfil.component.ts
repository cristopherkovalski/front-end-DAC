import { Component } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { NgForm } from '@angular/forms';
import { CepService } from '../services/cep.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';


@Component({
  selector: 'app-altera-perfil',
  templateUrl: './altera-perfil.component.html',
  styleUrls: ['./altera-perfil.component.css']
})
export class AlteraPerfilComponent {
  cliente = new Cliente();
  mensagem: string = '';
  mensagemCPF: string = '';

  constructor(private cepService: CepService, private router: Router, private login: LoginService, private clienteService: ClienteService, ) {
    const clienteResult = clienteService.clienteLogado();
    clienteService.buscarCliente(clienteResult.id).subscribe(
      (cliente: Cliente) => {
        this.cliente = cliente;
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
    this.clienteService.atualizarCliente(this.cliente);
    alert("atualizado com sucesso");
    this.router.navigate(['/home-cliente']);
  }


}

