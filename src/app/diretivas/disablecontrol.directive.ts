import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})

export class DisableControlDirective {

  @Input () set disableControl (condition : boolean) { 
    const action = condition ? 'disable' : 'enable'; 
    this.ngControl.control [action] (); 
    
    if (action == 'disable') {
      this.ngControl.reset();
    }
  } 

  constructor(private ngControl : NgControl) { }
}
