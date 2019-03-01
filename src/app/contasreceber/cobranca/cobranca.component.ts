import { Component } from '@angular/core';
import { CobrancaContato } from './models/cobranca';
import { Parcela } from '../titulo/models/titulo';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class CobrancaComponent {

  public parcela: Parcela[];
  public cobrancaContato : CobrancaContato;


  public constructor(){ 
    this.parcela = new Array();
    this.cobrancaContato = new CobrancaContato();
  }

  set Parcela(parcela : Parcela[]) {    
    this.parcela = parcela;    
  }

  get Parcela(): Parcela[] {
    return this.parcela;
  }

  set CobrancaContato(cobrancaContato : CobrancaContato) {    
    this.cobrancaContato = cobrancaContato;
  }

  get CobrancaContato(): CobrancaContato {
    return this.cobrancaContato;
  }
  
}
