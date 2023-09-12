import { Component, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AdminService } from '../services/admin.service';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta } from 'src/app/shared/models/conta.model';
import { TelefoneFormatDirective } from 'src/app/shared/directives/telefone-format.directive';
import { CpfFormatDirective } from 'src/app/shared/directives/cpf-format.directive';



@Component({
  selector: 'app-inserir-gerente',
  templateUrl: './inserir-gerente.component.html',
  styleUrls: ['./inserir-gerente.component.css']
})
export class InserirGerenteComponent {
  gerente = new Gerente;
  gerentes: Gerente[] = [];
  contas: Conta[] = [];
  clientes: Cliente[] = [];
  erro: string | null = null;
  conta = new Conta;
  isCpfValido: boolean = true;
  mensagemCPF: string = '';
  @ViewChild(TelefoneFormatDirective) telefoneFormatDirective!: TelefoneFormatDirective;
  @ViewChild(CpfFormatDirective) cpfFormatDirective!: CpfFormatDirective;


  constructor(private login: LoginService, private router: Router, private adminService: AdminService) { }


  inserirGerente(): void {
    this.gerente.cpf = this.removeMascara(this.gerente.cpf!);
    this.gerente.telefone = this.removeMascara (this.gerente.telefone!);
    this.adminService.adicionarGerente(this.gerente).pipe(
      switchMap((response) => {
        this.gerente.id = response.id;
        console.log('Gerente adicionado com sucesso:', response);
        return this.adminService.getContasList();
      })
    ).subscribe({
      next: (contas) => {
        console.log('Contas buscadas com sucesso:', contas);
        this.contas = contas;
        this.conta = this.encontrarContaGerenteComMaiorId(this.contas, this.getGerenteComMaisContas(this.contas)!)!;
        this.conta.gerenteId = this.gerente.id;
        this.adminService.atualizarConta(this.conta).subscribe({
          next: (response) => {
           alert('Conta atualizada com sucesso com o novo gerente.');
           console.log(response);
           this.router.navigate(['/home-admin']);
          },
          error: (error) => {
            alert('Erro ao atualizar conta')
            console.error('Erro ao vincular conta ao novo gerente:', error);
            this.router.navigate(['/home-admin']);
          }
        });
      },
      error: (error) => {
        alert('Erro ao adicionar gerente ou buscar contas: Tente novamente!')
        console.error('Erro ao adicionar gerente ou buscar contas: Tente novamente', error);
      }
    });
  }

  verificarCPF() {
    if (this.gerente.cpf === undefined) {
      this.isCpfValido = false;
      this.mensagemCPF = "Insira um CPF para verificar"

    } else {
      const cpfclean = this.removeMascara(this.gerente.cpf!);
      if (this.isValidCPF(cpfclean)) {
        this.isCpfValido = true;
        this.mensagemCPF = "CPF Válido"

      } else {
        this.isCpfValido = false;
        this.mensagemCPF = "CPF Inválido"
      }

    }
  }

  isValidCPF(cpf: string): boolean {
    const digits = cpf.split('').map(Number);
    const verifierDigit1 = digits[9];
    const verifierDigit2 = digits[10];
    if (cpf.length !== 11 || digits.every(digit => digit === digits[0])) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    let calculatedDigit1 = (sum * 10) % 11;
    calculatedDigit1 = calculatedDigit1 === 10 ? 0 : calculatedDigit1;
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    let calculatedDigit2 = (sum * 10) % 11;
    calculatedDigit2 = calculatedDigit2 === 10 ? 0 : calculatedDigit2;

    return verifierDigit1 === calculatedDigit1 && verifierDigit2 === calculatedDigit2;
  }

  removeMascara(mask: string): string {
    return mask.replace(/\D/g, '');
  }


  getGerenteComMaisContas(contas: any[]): number | null {
    const contasPorGerente = new Map<number, number>();

    for (let conta of contas) {
      const gerenteId = conta.gerenteId;
      if (contasPorGerente.has(gerenteId)) {
        contasPorGerente.set(gerenteId, contasPorGerente.get(gerenteId)! + 1);
      } else {
        contasPorGerente.set(gerenteId, 1);
      }
    }

    let gerenteComMaisContasId: number | null = null;
    let maiorNumeroDeContas = 0;
    contasPorGerente.forEach((numeroDeContas, gerenteId) => {
      if (numeroDeContas > maiorNumeroDeContas) {
        maiorNumeroDeContas = numeroDeContas;
        gerenteComMaisContasId = gerenteId;
      }
    });

    return gerenteComMaisContasId;
  }

  encontrarContaGerenteComMaiorId(contas: Conta[], gerenteId: number): Conta | null {
    let contasDoGerente = contas.filter(conta => conta.gerenteId === gerenteId);

    if (contasDoGerente.length === 0) {
      return null;
    }

    let contaComMaiorId = contasDoGerente[0];
    for (let conta of contasDoGerente) {
      if (conta.id! > contaComMaiorId.id!) {
        contaComMaiorId = conta;
      }
    }

    return contaComMaiorId;
  }





}
