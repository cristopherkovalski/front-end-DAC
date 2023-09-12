import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { AdminService } from '../services/admin.service';
import { TelefoneFormatDirective } from 'src/app/shared/directives/telefone-format.directive';
import { CpfFormatDirective } from 'src/app/shared/directives/cpf-format.directive';


@Component({
  selector: 'app-alterar-gerente',
  templateUrl: './alterar-gerente.component.html',
  styleUrls: ['./alterar-gerente.component.css']
})
export class AlterarGerenteComponent {
  @ViewChild(TelefoneFormatDirective) telefoneFormatDirective!: TelefoneFormatDirective;
  @ViewChild(CpfFormatDirective) cpfFormatDirective!: CpfFormatDirective;
  gerente: Gerente = new Gerente();

  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.gerente = JSON.parse(params['gerente']) as Gerente;
        setTimeout(() => {
        this.telefoneFormatDirective.formatPhone(this.gerente.telefone);
        this.cpfFormatDirective.formatCPF(this.gerente.cpf);
        });
      }
      );
  }
  removeMascara(mask: string): string {
    return mask.replace(/\D/g, '');
  }



  alterarGerente() {
    this.gerente.telefone = this.removeMascara(this.gerente.telefone!);
    this.gerente.cpf = this.removeMascara(this.gerente.cpf!);
    this.adminService.atualizarGerente(this.gerente).subscribe({
      next: (response) => {
        alert("Gerente: " + response.nome + " atualizado com sucesso!");
        this.router.navigate(['/home-admin']);

      },
      error: (error) => {
        alert('Ocorreu um erro ao atualizar o gerente: ' + error.message);
        this.router.navigate(['/home-admin']);
      }
    });
  }
}

