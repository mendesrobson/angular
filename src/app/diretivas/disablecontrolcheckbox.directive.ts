import { Directive, Input, ElementRef, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControlCheckBox]'
})

export class DisableControlCheckBoxDirective {

  @Input () set disableControlCheckBox (condition : boolean) { 
    const action = condition ? 'disable' : 'enable'; 
    this.ngControl.control [action] (); 
    
    if (action == 'disable') {
       this.ngControl.control.patchValue('N');
       this.re.setElementProperty(this.el.nativeElement, 'checked', false);
    }
  } 

  constructor(private ngControl : NgControl,
              private el: ElementRef,
              private re: Renderer) { }
}
