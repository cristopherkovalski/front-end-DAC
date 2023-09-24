import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCepFormat]'
})
export class CepFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const input = event.target.value;
    this.formatCep(input);
  }

  formatCep(input:any){
    let numbersOnly = input.replace(/\D/g, '');
    const maxDigits = 8; // Máximo de dígitos permitidos para um CEP

    if (numbersOnly.length > maxDigits) {
      numbersOnly = numbersOnly.slice(0, maxDigits);
    }

    this.el.nativeElement.value = numbersOnly.replace(/^(\d{5})(\d{3})$/, '$1-$2');

    return  this.el.nativeElement.value;
  }
}
