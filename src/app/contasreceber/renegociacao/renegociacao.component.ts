import { Component } from '@angular/core';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { Parcela } from '../titulo/models/titulo';
import { Renegociacao } from './models/renegociacao';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class RenegociacaoComponent {
  public renegociacao: Renegociacao;   
  public parcela : Parcela;
  public parcelas: Parcela[];
  public parcelasRenegociadas : Parcela[];
  public parcelaRenegociada: Parcela;

  public constructor(){ 
    this.parcelas = new Array();
    this.renegociacao = new Renegociacao();
  }

  set Parcelas(parcelas: Parcela[]) {
    this.parcelas = parcelas;
  }

  get Parcelas(): Parcela[] {
    return this.parcelas;
  }
  
  set Parcela(parcela: Parcela) {
    this.parcela = parcela;
  }

  get Parcela(): Parcela {
    return this.parcela;
  }

  set ParcelaRenegociada(parcelaRenegociada: Parcela) {
    this.parcela = parcelaRenegociada;
  }

  get ParcelaRenegociada(): Parcela {
    return this.parcelaRenegociada;
  }

  set ParcelasRenegociadas(parcelasRenegociadas: Parcela[]) {
    this.parcelasRenegociadas = parcelasRenegociadas;
  }

  get ParcelasRenegociadas(): Parcela[] {
    return this.parcelasRenegociadas;
  }
  
  set Renegociacao(renegociacao: Renegociacao) {
    this.renegociacao = renegociacao;
  }

  get Renegociacao(): Renegociacao {
    return this.renegociacao;
  }

}

