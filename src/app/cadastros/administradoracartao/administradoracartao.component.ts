import { Component } from '@angular/core';
import { Administradoracartao, AdministradoraCartaoEndereco, AdministradoraCartaoContato } from './models/administradoracartao';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class AdministradoracartaoComponent {

  public administradoraCartao: Administradoracartao;
  public administradoraCartaoEndereco: AdministradoraCartaoEndereco;
  public administradoraCartaoContato: AdministradoraCartaoContato;


  public constructor(){ 
    this.administradoraCartao = new Administradoracartao();
    this.administradoraCartaoEndereco = new AdministradoraCartaoEndereco();
    this.administradoraCartaoContato = new AdministradoraCartaoContato();
    this.administradoraCartao.administradoraCartaoEndereco = new Array();
    this.administradoraCartao.administradoraCartaoContato = new Array();
  }

  set Administradoracartao(administradoraCartao: Administradoracartao) {
    this.administradoraCartao = administradoraCartao;
  }

  get Administradoracartao(): Administradoracartao {
    return this.administradoraCartao;
  }

  set AdministradoracartaoEndereco(administradoraCartaoEndereco: AdministradoraCartaoEndereco) {
    this.administradoraCartaoEndereco = administradoraCartaoEndereco;
  }

  get AdministradoracartaoEndereco(): AdministradoraCartaoEndereco {
    return this.administradoraCartaoEndereco;
  }

  set AdministradoracartaoContato(administradoraCartaoContato: AdministradoraCartaoContato) {
    this.administradoraCartaoContato = administradoraCartaoContato;
  }

  get AdministradoracartaoContato(): AdministradoraCartaoContato {
    return this.administradoraCartaoContato;
  }


}
