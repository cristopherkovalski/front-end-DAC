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

  clientes!: Cliente[];
  gerente !: Usuario;


  ngOnInit(): void {
    
    this.gerente = this.gerenteService.gerenteLogado();
    console.log(this.gerente);
      //não gosto disso mas é o q tá tendo
    this.buscaClientesAnalise();
  }


  buscaClientesAnalise(){
    this.gerenteService.getContasAprovacao(this.gerente.id_user!).subscribe(contas =>{
      if (contas){
        this.clientes = [];
        contas.forEach(conta => {
          this.gerenteService.getClientesById(conta.id_cliente!).subscribe(cliente =>{
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
      
      })
    }
  };

  

  recusarCliente(cliente:Cliente){
    console.log("Cliente reporvado");
    if(confirm("Deseja realmente Recusar esse cliente?")){
      let motivo = prompt("Por qual motivo está recusando esse cliente?");
      if (motivo){
        this.gerenteService.reprovarCliente(cliente, motivo).subscribe(response =>{
        })
      }else{
        alert("Sem motivo sem recusa");
      }
      
    }

  };

 

}
