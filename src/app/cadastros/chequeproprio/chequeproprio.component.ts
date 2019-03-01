import { Component } from '@angular/core';
import { ChequeTalao, ChequeFolha, Banco, Agencia } from './models/chequeproprio';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class ChequeproprioComponent {

  public chequeTalao: ChequeTalao;
  public chequeFolha: ChequeFolha;

  public dirty: boolean;

  constructor() { 
    this.chequeTalao = new ChequeTalao();
    this.chequeFolha = new ChequeFolha();
    this.chequeTalao.chequeFolha = new Array();
    this.ChequeFolha.chequeFolhaHistorico = new Array();
  }

  set ChequeTalao(chequeTalao: ChequeTalao) {
    this.chequeTalao = chequeTalao;
  }

  get ChequeTalao(): ChequeTalao {
    return this.chequeTalao;
  }

  set ChequeFolha(chequeFolha: ChequeFolha) {
    this.chequeFolha = chequeFolha;
  }

  get ChequeFolha(): ChequeFolha {
    return this.chequeFolha;
  }
}
