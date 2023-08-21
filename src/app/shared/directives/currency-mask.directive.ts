import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[CurrencyMask]'
})
export class CurrencyMaskDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target;
    let value = input.value.replace(/[^\d,.-]/g, '');
    console.log(value)
    // const floatValue = parseFloat(value) / 100;
    value = parseFloat(value)

    if (value >= 0) {
      input.value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    } else {
      input.value = '';
    }
  }
}




// function formatCurrency(value: number): string {
//   const formattedValue = value.
//   return formattedValue;
// }

// const numericValue = 1234.56;
// const formattedCurrency = formatCurrency(numericValue);

// console.log(formattedCurrency); // Saída: R$ 1.234,56
