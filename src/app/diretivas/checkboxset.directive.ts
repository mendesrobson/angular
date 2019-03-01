import { Directive, Input, HostListener, ElementRef, Renderer, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[checkBoxSet]'
})

export class CheckBoxSetDirective {
   
  @Input () set checkBoxSet (str : string) {

    if (str==='S') {
      this.re.setElementProperty(this.el.nativeElement, 'checked', true);      
    }
    else {
      this.re.setElementProperty(this.el.nativeElement, 'checked', false);
    }
  } 

  constructor(private ngControl : NgControl,
    private el: ElementRef, 
    private re: Renderer) { }
  
  @HostListener('change', ['$event'])
  onchange(event : Event) {
    const input = event.target as HTMLInputElement;
    let value = (input.checked);
    
    if (value) {
      this.ngControl.control.patchValue('S');
      this.re.setElementProperty(this.el.nativeElement, 'checked', value);      
    }
    else {
      this.ngControl.control.patchValue('N');
      this.re.setElementProperty(this.el.nativeElement, 'checked', value);
    }
    
  }
}





