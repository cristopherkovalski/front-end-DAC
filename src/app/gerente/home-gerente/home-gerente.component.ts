import { Component, OnInit } from '@angular/core';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { GerenteService } from '../services/gerente.service';
import { Gerente } from 'src/app/shared/models/gerente.model';
import { Usuario } from 'src/app/shared/models/usuario.model';

@Component({
  selector: 'app-home-gerente',
  templateUrl: './home-gerente.component.html',
  styleUrls: ['./home-gerente.component.css']
})
export class HomeGerenteComponent implements OnInit{

  constructor(private gerenteService:GerenteService){}

  clientes: Cliente[] = [];
  gerente !: Usuario;


  ngOnInit(): void {
      this.gerente = this.gerenteService.gerenteLogado();

      //não gosto disso mas é o q tá tendo
      this.buscaClientesAnalise();
  }


  buscaClientesAnalise(){
    this.clientes = [];
    this.gerenteService.getContasAprovacao(this.gerente.id!).subscribe(contas =>{
      if (contas){
        contas.forEach(conta => {
          this.gerenteService.getClientesById(conta.id_cliente!).subscribe(cliente =>{
            // console.log(cliente)
            this.clientes.push(cliente)
          })
        });
      }else
        this.clientes = []
    })
  }
  

  aprovarCliente(cliente:Cliente){
    if(confirm("Deseja Aprovar esse cliente?")){
      
      this.gerenteService.aprovarCliente(cliente).subscribe(response =>{
        if(response){
          alert("Senha do cliente:" + response.senha);

          this.buscaClientesAnalise();
        }else{
          alert("Algo deu errado tente novamente mais tarde");
        }
        
      })
    }
  };

  

  recusarCliente(cliente:Cliente){
    console.log("Cliente reporvado");
    if(confirm("Deseja realmente Recusar esse cliente?")){
      let motivo = prompt("Por qual motivo está recusando esse cliente?");
      if (motivo){
        this.gerenteService.reprovarCliente(cliente, motivo).subscribe(response =>{
          if(response){
            alert("Conta recusada!");
            this.buscaClientesAnalise();
          } else
            alert("Algo deu errado tente novamente mais tarde");
        })
      }else{
        alert("Sem motivo sem recusa");
      }
      
    }

  };

 

}
