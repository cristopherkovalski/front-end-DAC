import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[numericoFaz]'
})
export class NumericoDirective {

  constructor(private el: ElementRef) { }

  @HostListener ('keyup', ['$event'])
  onKeyUp($event: any){
    let valor = $event.target.value;

    valor = valor.replace(/[\D]/g, '');
    
    $event.target.value = valor;
  }
}
