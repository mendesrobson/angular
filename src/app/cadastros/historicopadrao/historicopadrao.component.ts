import { Component } from '@angular/core';
import { HistoricoPadrao, HistoricoPadraoCentro } from '../historicopadrao/models/historicopadrao';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class HistoricopadraoComponent  {

  public historicoPadrao: HistoricoPadrao;
  public historicoPadraoCentro : HistoricoPadraoCentro;


  public constructor() { 
    this.historicoPadrao = new HistoricoPadrao();
    this.historicoPadraoCentro = new HistoricoPadraoCentro();
    this.historicoPadrao.historicoPadraoCentro = new Array();
  }

  set HistoricoPadrao(historicoPadrao : HistoricoPadrao) {    
    this.historicoPadrao = historicoPadrao;
  }

  get HistoricoPadrao(): HistoricoPadrao {
    return this.historicoPadrao;
  }

  set HistoricoPadraoCentro(historicoPadraoCentro : HistoricoPadraoCentro) {    
    this.historicoPadraoCentro = historicoPadraoCentro;
  }

  get HistoricoPadraoCentro(): HistoricoPadraoCentro {
    return this.historicoPadraoCentro;
  }

}

