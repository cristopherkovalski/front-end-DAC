import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCpfFormat]'
})
export class CpfFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const input = event.target.value;
    this.formatCPF(input);
  
  }

  formatCPF(input: any){
    let numbersOnly = input.replace(/\D/g, '');
  
    if (numbersOnly.length > 11) {
      numbersOnly = numbersOnly.slice(0, 11);
    }
  
    if (numbersOnly.length <= 3) {
      this.el.nativeElement.value = numbersOnly;
    } else if (numbersOnly.length <= 6) {
      this.el.nativeElement.value = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3)}`;
    } else if (numbersOnly.length <= 9) {
      this.el.nativeElement.value = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6)}`;
    } else {
      this.el.nativeElement.value = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`;
    }
  }
}
