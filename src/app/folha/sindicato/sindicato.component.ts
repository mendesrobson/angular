import { Component } from '@angular/core';
import { Sindicato, SindicatoCargo, SindicatoConvencao, DiretoriaSindical, BaseTerritorialSindicato } from './models/sindicato';

@Component({
  template: '<router-outlet></router-outlet>'
})
export class SindicatoComponent {

  public sindicato: Sindicato;
  public sindicatoCargo: SindicatoCargo;
  public sindicatoConvencao: SindicatoConvencao;
  public diretoriaSindical: DiretoriaSindical;
  public baseTerritorialSindicato: BaseTerritorialSindicato;
  public excluido: boolean;

  public dirty: boolean;

  public constructor() {
    this.sindicato = new Sindicato();
    this.sindicatoCargo = new SindicatoCargo();
    this.sindicatoConvencao = new SindicatoConvencao();
    this.diretoriaSindical = new DiretoriaSindical();
    this.baseTerritorialSindicato = new BaseTerritorialSindicato();
    
    this.sindicato.sindicatoCargo = new Array();
    this.sindicato.sindicatoConvencao = new Array();
    this.sindicato.diretoriaSindical = new Array();
    this.sindicato.baseTerritorialSindicato = new Array();

  }

  set Sindicato(sindicato: Sindicato) {
    this.sindicato = sindicato;
  }
  get Sindicato(): Sindicato {
    return this.sindicato;
  }

  set SindicatoCargo(sindicatoCargo: SindicatoCargo) {
    this.sindicatoCargo = sindicatoCargo;
  }
  get SindicatoCargo(): SindicatoCargo {
    return this.sindicatoCargo;
  }

  set BaseTerritorialSindicato(baseTerritorialSindicato: BaseTerritorialSindicato) {
    this.baseTerritorialSindicato = baseTerritorialSindicato;
  }
  get BaseTerritorialSindicato(): BaseTerritorialSindicato {
    return this.baseTerritorialSindicato;
  }

  set SindicatoConvencao(sindicatoConvencao: SindicatoConvencao) {
    this.sindicatoConvencao = sindicatoConvencao;
  }
  get SindicatoConvencao(): SindicatoConvencao {
    return this.sindicatoConvencao;
  }

  set DiretoriaSindical(diretoriaSindical: DiretoriaSindical) {
    this.diretoriaSindical = diretoriaSindical;
  }

  get DiretoriaSindical(): DiretoriaSindical {
    return this.diretoriaSindical;
  }

  set Excluido(excluido: boolean) {
    this.excluido = excluido;
  }

  get Excluido() {
    return this.excluido;
  }
}
