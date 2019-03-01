import { Component } from '@angular/core';
import { MovimentoConta } from './models/movimentoconta';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class ConciliacaoBancariaComponent {
  public movimentoConta:MovimentoConta[];
  public constructor(){ 
    this.movimentoConta = new Array();
  }

  set MovimentoConta(administradoraCartaoEndereco: MovimentoConta[]) {
    this.movimentoConta = administradoraCartaoEndereco;
  }

  get MovimentoConta(): MovimentoConta[] {
    return this.movimentoConta;
  }
}
