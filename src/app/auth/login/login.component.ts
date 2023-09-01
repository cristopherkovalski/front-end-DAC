import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';

import { Login } from 'src/app/shared/models/login.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/shared/models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('formLogin') formLogin!: NgForm;
  message!:string;

  auth: Login = new Login();

  constructor(private loginService:LoginService, private router:Router, private route:ActivatedRoute){

    let user = this.loginService.usuarioLogado;
    if(user){
       
      if (user.type == 'CLIENTE'){
        this.router.navigate(["/home-cliente"])
      }else if(user.type == "GERENTE"){
        this.router.navigate(["/home-cliente"])
      }else if(user.type == "ADMIN"){
        this.router.navigate(["/home-cliente"])
      }

    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        this.message = params['error'];
    })
  }

  login(){
    if(this.formLogin.form.valid){
      this.loginService.logar(this.auth).subscribe((user) =>{
        if(user){
          this.loginService.usuarioLogado = user;
          if(user.type == "CLIENTE"){
            this.router.navigate(["/home-cliente"]);
          }else if(user.type == "GERENTE"){
            this.router.navigate(["/home-gerente"]) 
          }else if(user.type == "ADMIN"){
            this.router.navigate(["/home-admin"]);
          }
        }else{
          this.message = "Usuario/Senha inválidos";
        }

      })
    }
  }
}
