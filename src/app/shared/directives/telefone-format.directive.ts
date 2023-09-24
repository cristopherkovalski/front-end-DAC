import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTelefoneFormat]'
})
export class TelefoneFormatDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const input = event.target.value;
    this.formatPhone(input);

  }
  
  formatPhone(input:any) {
    let numbersOnly = input.replace(/\D/g, '');
    const maxDigits = 11;

    if (numbersOnly.length > maxDigits) {
      numbersOnly = numbersOnly.slice(0, maxDigits);
    }
    if (numbersOnly.length <= 2) {
      this.el.nativeElement.value = `(${numbersOnly}`;
    } else if (numbersOnly.length <= 7) {
      this.el.nativeElement.value = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    } else {
      this.el.nativeElement.value = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7)}`;
    }

    return this.el.nativeElement.value;
  }
}

