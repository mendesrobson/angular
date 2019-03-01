import { Component } from '@angular/core';
import { ContaCorrente, ContaCorrenteCobranca } from './models/contacorrente';


@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class ContaCorrenteComponent {

  public contaCorrente: ContaCorrente;
  public contaCorrenteCobranca : ContaCorrenteCobranca;
  public constructor() {

    this.contaCorrente = new ContaCorrente();
    this.contaCorrente.contaCorrenteCobranca = [];
    this.contaCorrenteCobranca = new ContaCorrenteCobranca();
    
  }

  public logContaCorrenteComponent() {
  }

  set ContaCorrente(cc: ContaCorrente) {
    this.contaCorrente = cc;
    this.contaCorrente.contaCorrenteCobranca = cc.contaCorrenteCobranca;
  }

  get ContaCorrente(): ContaCorrente {
    return this.contaCorrente;
  }

  set ContaCorrenteCobranca(ccc : ContaCorrenteCobranca) {
    this.contaCorrenteCobranca = ccc;
  }

  get ContaCorrenteCobranca(): ContaCorrenteCobranca {
    return this.contaCorrenteCobranca;
  }

}