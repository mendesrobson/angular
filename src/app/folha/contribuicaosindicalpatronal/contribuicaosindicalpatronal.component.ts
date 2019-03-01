import { Component } from '@angular/core';
import { ContribuicaoSindicalPatronal, ContrSindPatReceitaBruta, ContrSindPatNumeroAlunos, ContrSindPatCapitalSocial } from './models/contribuicaosindicalpatronal';

@Component({
  template: `<router-outlet></router-outlet> `
})
export class ContribuicaosindicalpatronalComponent {

  public contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal;
  public contrSindPatNumeroAluno: ContrSindPatNumeroAlunos;
  public contrSindPatReceitaBruta: ContrSindPatReceitaBruta;
  public contrSindPatCapitalSocial: ContrSindPatCapitalSocial;
  public dirty: boolean;
  public excluido: boolean;

  public constructor() {

    this.contribuicaoSindicalPatronal = new ContribuicaoSindicalPatronal();
    this.contrSindPatReceitaBruta = new ContrSindPatReceitaBruta();
    this.contrSindPatNumeroAluno = new ContrSindPatNumeroAlunos();
    this.contrSindPatCapitalSocial = new ContrSindPatCapitalSocial();
    this.contribuicaoSindicalPatronal.contrSindPatReceitaBruta = new Array();
    this.contribuicaoSindicalPatronal.contrSindPatNumeroAluno = new Array();
    this.contribuicaoSindicalPatronal.contrSindPatCapitalSocial = new Array();
  }

  set ContribuicaoSindicalPatronal(contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal) {
    this.contribuicaoSindicalPatronal = contribuicaoSindicalPatronal;
  }
  get ContribuicaoSindicalPatronal(): ContribuicaoSindicalPatronal {
    return this.contribuicaoSindicalPatronal;
  }

  set ContrSindPatNumeroAluno(contrSindPatNumeroAluno: ContrSindPatNumeroAlunos) {
    this.contrSindPatNumeroAluno = contrSindPatNumeroAluno;
  }
  get ContrSindPatNumeroAluno(): ContrSindPatNumeroAlunos {
    return this.contrSindPatNumeroAluno;
  }

  set ContrSindPatReceitaBruta(contrSindPatReceitaBruta: ContrSindPatReceitaBruta) {
    this.contrSindPatReceitaBruta = contrSindPatReceitaBruta;
  }
  get ContrSindPatReceitaBruta(): ContrSindPatReceitaBruta {
    return this.contrSindPatReceitaBruta;
  }

  set ContrSindPatNumeroAlunos(contrSindPatNumeroAlunos: ContrSindPatNumeroAlunos) {
    this.contrSindPatNumeroAluno = contrSindPatNumeroAlunos;
  }
  get ContrSindPatNumeroAlunos(): ContrSindPatNumeroAlunos {
    return this.contrSindPatNumeroAluno;
  }

  set ContrSindPatCapitalSocial(contrSindPatCapitalSocial: ContrSindPatCapitalSocial) {
    this.contrSindPatCapitalSocial = contrSindPatCapitalSocial;
  }
  get ContrSindPatCapitalSocial(): ContrSindPatCapitalSocial {
    return this.contrSindPatCapitalSocial;
  }

  set Excluido(excluido: boolean) {
    this.excluido = excluido;
  }

  get Excluido() {
    return this.excluido;
  }
}