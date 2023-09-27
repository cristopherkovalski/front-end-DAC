import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from './services/login.service';
import { useAnimation } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate{
  constructor(
      private loginServicec : LoginService,
      private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{

      const usuarioLogado = this.loginServicec.usuarioLogado;
      let url = state.url;
      if(usuarioLogado){
        if(route.data?.['role'] && route.data?.['role'].indexOf(usuarioLogado.type) === -1){
          this.router.navigate(['/login'], {queryParams: {error: "Proibido Acesso a " + url}});
          return false;
        }

        return true;
      }

      this.router.navigate(['/login'], {queryParams: {error: "Deve fazer o login antes de acesasr " + url}});
      return false;

    }

    
    
    
 
};
