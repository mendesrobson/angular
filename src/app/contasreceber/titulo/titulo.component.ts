
import { Component } from '@angular/core';
import { Titulo, Parcela, Cliente, TipoDocumento, ContaCorrente, Origem, Natureza, ConfiguracaoPagamento, TituloDesconto, TituloCentro, HistoricoPadrao, TituloParcela, ParcelaDesconto, ApropriacaoCentro } from '../titulo/models/titulo';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class TituloComponent {


  public titulo: Titulo;
  public titulos: Titulo[];
  public tituloDesconto : TituloDesconto;
  public tituloCentro : TituloCentro;
  public parcelaDesconto : ParcelaDesconto;
  public parcela : Parcela;
  public dirty: boolean;
  //public apropriacaoCentro: ApropriacaoCentro;

  public constructor(){ 
    this.titulo = new Titulo();
    this.titulo.tituloDesconto = [];
    this.tituloDesconto = new TituloDesconto();
    this.titulo.tituloCentro = [];
    this.tituloCentro = new TituloCentro();
    this.parcelaDesconto = new ParcelaDesconto();
    this.titulos = new Array();
   // this.apropriacaoCentro = new ApropriacaoCentro
  }


  set Titulo(titulo: Titulo){
    this.titulo = titulo;
    this.titulo.tituloDesconto = titulo.tituloDesconto;
    this.titulo.tituloCentro = titulo.tituloCentro;
  }

  get Titulo(): Titulo {
    return this.titulo;
  }
  
  set Titulos(titulo: Titulo[]){
    this.titulos = titulo;
  }

  get Titulos(): Titulo[] {
    return this.titulos;
  }

  set Parcela(parcela : Parcela) {    
    this.parcela = parcela;
  }

  get Parcela(): Parcela {
    return this.parcela;
  }

  set TituloDesconto(tituloDesconto : TituloDesconto) {    
    this.tituloDesconto = tituloDesconto;
  }

  get TituloDesconto(): TituloDesconto {
    return this.tituloDesconto;
  }

  set TituloCentro(tituloCentro : TituloCentro) {
    this.tituloCentro = tituloCentro;
  }

  get TituloCentro() : TituloCentro {
    return this.tituloCentro;
  }

  set ParcelaDesconto(parcelaDesconto : ParcelaDesconto) {    
    this.parcelaDesconto = parcelaDesconto;
  }

  get ParcelaDesconto(): ParcelaDesconto {
    return this.parcelaDesconto;
  }

}