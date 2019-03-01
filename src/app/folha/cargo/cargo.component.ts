import { Component } from '@angular/core';
import { Cargo, CargoCbo } from './models/cargo';

@Component({
  template: `<router-outlet></router-outlet> `
})
export class CargoComponent {
  public cargo : Cargo;
  public cargoCbo : CargoCbo;
  public dirty: boolean;
  public excluido: boolean;

  public constructor() {
    this.cargo = new Cargo();
    this.cargoCbo = new CargoCbo();
    this.cargo.cargoCbo = new Array();
   }

   set Cargo(cargo: Cargo) {
        this.cargo = cargo;
   }
   get Cargo(): Cargo {
        return this.cargo;
   }

   set CargoCbo(cargoCbo: CargoCbo) {
     this.cargoCbo = cargoCbo;
   }
   get CargoCbo() : CargoCbo {
     return this.cargoCbo;
   }
   
   set Excluido(excluido:boolean){
     this.excluido = excluido;
   }

   get Excluido(){
    return this.excluido;
   }

  }
