import { Component } from '@angular/core';
import { MovimentoConta, MovimentoContaCentro, BaixaPagarReceberPgto, BaixaPagarReceber } from './models/tituloparcelabaixa';
import { Parcela } from '../titulo/models/titulo';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class TituloParcelaBaixaComponent {
  public movimentoConta: MovimentoConta;
  public movimentoContaCentro: MovimentoContaCentro;
  public parcelas: Parcela[];
  public baixaPagarReceber: BaixaPagarReceber;
  public baixaPagarReceberPgtos: BaixaPagarReceberPgto[];
  public baixaPagarReceberPgto: BaixaPagarReceberPgto;
  public dirty:boolean; 
  public habilitar:boolean; 

  public constructor() {
    this.movimentoConta = new MovimentoConta();
    this.movimentoConta.movimentoContaCentro = [];
    this.movimentoContaCentro = new MovimentoContaCentro();
    this.parcelas = new Array();
    this.baixaPagarReceber = new BaixaPagarReceber();
    this.baixaPagarReceberPgtos = new Array(); 
    this.baixaPagarReceberPgto = new BaixaPagarReceberPgto();
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
  
  set Parcelas(parcelas: Parcela[]) {
    this.parcelas = parcelas;
  }

  get Parcelas(): Parcela[] {
    return this.parcelas;
  }

  set BaixaPagarReceber(baixaPagarReceber: BaixaPagarReceber) {
    this.baixaPagarReceber = baixaPagarReceber;
  }

  get BaixaPagarReceber(): BaixaPagarReceber {
    return this.baixaPagarReceber;
  }

  set BaixaPagarReceberPgtos(baixaPagarReceberPgtos: BaixaPagarReceberPgto[]) {
    this.baixaPagarReceberPgtos = baixaPagarReceberPgtos;
  }

  get BaixaPagarReceberPgtos(): BaixaPagarReceberPgto[] {
    return this.baixaPagarReceberPgtos;
  }

  set BaixaPagarReceberPgto(baixaPagarReceberPgto: BaixaPagarReceberPgto) {
    this.baixaPagarReceberPgto = baixaPagarReceberPgto;
  }

  get BaixaPagarReceberPgto(): BaixaPagarReceberPgto {
    return this.baixaPagarReceberPgto;
  }

  set Habilitar(habilitar: boolean) {
    this.habilitar = habilitar;
  }

  get Habilitar(): boolean {
    return this.habilitar;
  }
}
