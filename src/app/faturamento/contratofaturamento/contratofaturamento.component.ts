import { Component } from '@angular/core';
import { ContratoFaturamento} from './models/contratofaturamento';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})



export class ContratoFaturamentoComponent {

  public contratoFaturamentos: ContratoFaturamento[];

  public constructor() {
    this.contratoFaturamentos = new Array();
  }

  get ContratoFaturamentos(): ContratoFaturamento[] {
    return this.contratoFaturamentos;
  }

  set ContratoFaturamentos(contratoFaturamentos: ContratoFaturamento[]){
    this.contratoFaturamentos  = contratoFaturamentos;
  }
}
