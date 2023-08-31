import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private correiosApiUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) { }

  consultarCep(cep: string): Observable<any> {
    const apiUrl = `${this.correiosApiUrl}/${cep}/json/`;
      return this.http.get(apiUrl).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            // Retorna a mensagem de erro para ser tratada no componente
            return throwError('CEP inválido. Verifique e tente novamente.');
          } else {
            return throwError('Algo deu errado. Tente novamente mais tarde.');
          }
        })
      );
  }


}
