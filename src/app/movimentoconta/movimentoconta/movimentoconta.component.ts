import { Component } from '@angular/core';
import { MovimentoConta, MovimentoContaCentro } from './models/movimentoconta';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class MovimentoContaComponent {

  public movimentoConta: MovimentoConta;
  public movimentoContaCentro: MovimentoContaCentro;

  public constructor() {
    this.movimentoConta = new MovimentoConta();
    this.movimentoConta.movimentoContaCentro = [];
    this.movimentoContaCentro = new MovimentoContaCentro();

  }

  set MovimentoConta(movimentoConta: MovimentoConta) {
    this.movimentoConta = movimentoConta;
    this.movimentoConta.movimentoContaCentro = movimentoConta.movimentoContaCentro

  }

  get MovimentoConta(): MovimentoConta {
    return this.movimentoConta
  }

  set MovimentoContaCentro(movimentoContaCentro : MovimentoContaCentro) {
    this.movimentoContaCentro = movimentoContaCentro;

  }

  get MovimentoContaCentro() : MovimentoContaCentro {
    return this.movimentoContaCentro;
  }
}