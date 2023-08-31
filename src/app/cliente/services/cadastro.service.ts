import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(private http: HttpClient) { }

  insereCliente(cliente: Cliente): Observable<any> {
    return this.http.post('url', cliente);
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

  

  /*verificaCPF(cpf: string): boolean {
    

  }

  */
}
