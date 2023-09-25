import { Component, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { CpfFormatDirective } from 'src/app/shared/directives/cpf-format.directive';
import { TelefoneFormatDirective } from 'src/app/shared/directives/telefone-format.directive';
import { Conta } from 'src/app/shared/models/conta.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-manutencao-admin',
  templateUrl: './manutencao-admin.component.html',
  styleUrls: ['./manutencao-admin.component.css']
})
export class ManutencaoAdminComponent {
  @ViewChild(TelefoneFormatDirective) telefoneFormatDirective!: TelefoneFormatDirective;
  @ViewChild(CpfFormatDirective) cpfFormatDirective!: CpfFormatDirective;
  gerentes: Gerente[] = [];
  contas: Conta[] = [];
  contasGerente: Conta[] = [];
  gerenteAlt: Gerente = new Gerente;
  isDeleteValid: boolean = false;

  constructor(private login: LoginService, private router: Router, private adminService: AdminService) {



  }

  ngOnInit(): void {
    this.setGerentesList();
    this.setContasList();
  }

  formatCPF(cpf: String): string {
    {
      let numbersOnly = cpf.replace(/\D/g, '');

      if (numbersOnly.length <= 3) {
        return numbersOnly;
      } else if (numbersOnly.length <= 6) {
        return `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3)}`;
      } else if (numbersOnly.length <= 9) {
        return `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6)}`;
      } else {
        return `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`;
      }
    }
  }

  setGerentesList() {
    this.adminService.getGerentesList().subscribe({
      next: (gerentes) => {
        this.gerentes = gerentes.map((gerente) => ({
          ...gerente,
          cpf: this.formatCPF(gerente.cpf!),
          telefone: this.formatTelefone(gerente.telefone!)
        }));
        if (this.gerentes.length === 1) {
          this.isDeleteValid = true;
        }
      },
      error: (error) => {
        alert('Ocorreu um erro ao buscar os gerentes: ' + error.message);
      }
    });
  }

  setContasList() {
    this.adminService.getContasList().subscribe({
      next: (contas) => {
        this.contas = contas;
      },
      error: (error) => {
        console.error('Erro ao buscar as contas', error);
      }
    });
  }

  formatTelefone(telefone: String): string {
    let numbersOnly = telefone.replace(/\D/g, '');
    let maxDigits = 11;

    if (numbersOnly.length > maxDigits) {
      numbersOnly = numbersOnly.slice(0, maxDigits);
    }

    if (numbersOnly.length <= 2) {
      return `(${numbersOnly}`;
    } else if (numbersOnly.length <= 7) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    } else {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7)}`;
    }
  }


  alteraGerente(gerente: Gerente) {
    this.router.navigate(["/alterar-gerente"], { queryParams: { gerente: JSON.stringify(gerente) } });

  }



  excluirGerente(gerente: Gerente) {
    console.log(gerente.id);

    const contasDoGerente = this.contas.filter(conta => conta.gerenteId === gerente.id);
    console.log(contasDoGerente);

    if (this.gerentes.length === 1) {
      alert("Não será possível excluir gerente! Existe apenas um Gerente no banco.");
    } else if (contasDoGerente.length === 0) {
      this.adminService.excluirGerente(gerente).subscribe({
        next: (response) => {
          alert("Gerente Excluído com sucesso");
          console.log('Contas vinculadas com sucesso!', response);
          this.setGerentesList();
          this.setContasList();
        },
        error: (error) => {
          console.error('Erro ao atualizar gerenteId das contas', error);
        }
      });
    } else {
      const gerenteComMenosContas = this.encontrarGerenteComMenosContas(this.contas);
      
      const updateAccountObservables = contasDoGerente.map(conta =>
        this.adminService.atualizarGerenteIdDaConta(conta.id!, gerenteComMenosContas!.id!) //derrubando o server
      );
    
      forkJoin(updateAccountObservables).subscribe({
        next: (contasAtualizadas) => {
          alert("Contas vinculadas atualizadas com sucesso!");
          this.adminService.excluirGerente(gerente).subscribe({
            next: (response) => {
              alert("Gerente Excluído com sucesso");
              this.setGerentesList();
              this.setContasList();
            },
            error: (error) => {
              console.error('Erro ao atualizar gerenteId das contas', error);
            }
          });
        },
        error: (error) => {
          console.error('Erro ao atualizar gerenteId das contas', error);
        }
      });
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
    let maiorIdDoGerenteComMenosContas = -1;

    this.gerentes.forEach((gerente) => {
      let gerenteId = gerente.id;
      if (gerenteId !== undefined) {
        let quantidadeDeContas = contasPorGerente[gerenteId] || 0;
        if (quantidadeDeContas < menorQuantidadeDeContas) {
          menorQuantidadeDeContas = quantidadeDeContas;
          maiorIdDoGerenteComMenosContas = gerenteId!;
          gerenteComMenosContas = gerente;
        } else if (quantidadeDeContas === menorQuantidadeDeContas && gerenteId! > maiorIdDoGerenteComMenosContas) {
          maiorIdDoGerenteComMenosContas = gerenteId!;
          gerenteComMenosContas = gerente;
        }
      }
    });

    return gerenteComMenosContas;
  }







  verifyLogin(): boolean {
    if (this.login.usuarioLogado) {
      return true;
    } else {
      return false;
    }
  }
}

