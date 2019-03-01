import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/usuario';

@Component({
  template: '<router-outlet></router-outlet>'
})

export class UsuarioComponent {

  public usuario: Usuario;
  public constructor() {
    this.usuario = new Usuario();
    this.usuario.papeis = new Array();
  }
  
  set Usuario(usuario: Usuario) {
    this.usuario = usuario;
  }

  get Usuario(): Usuario {
    return this.usuario;
  }

}