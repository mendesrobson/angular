import { Router } from '@angular/router';
import { Injectable, OnInit, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../../environments/environment';
import { IUsuario } from '../interfaces/iusuario.model';
import { Usuario } from '../../../seguranca/usuario/models/usuario';

@Injectable()
export class AuthService implements OnInit {

  public usuario: Usuario;
  
  constructor(private httpClient: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
  }

  check(): boolean {
    return localStorage.getItem('usuario') ? true : false;
  }

  login(f): Observable<boolean> {

    let p = Object.assign({}, this.usuario, f.value);
    console.log(p);
    return this.httpClient.post<any>(`${environment.url_identity}/usuarios/login`, p)
      .map(user => {
        localStorage.clear();
        localStorage.setItem('usuario', JSON.stringify(user));
        localStorage.setItem("primeiroNome", JSON.stringify(user.primeiroNome));
        localStorage.setItem("email", JSON.stringify(user.email));
        var userRoles = user.userRoles;
        var papeisNome = new Array();
        userRoles.forEach(element => {
          papeisNome.push(element.papelNome);
        });
        localStorage.setItem("userRoles", JSON.stringify(papeisNome));
        return user;
      });
  }

  logout(): void {
    this.httpClient.get(`${environment.url_faturamento_Identy}/authentication/logout`).subscribe(resp => {
      localStorage.clear();
      this.router.navigate(['/authentication/login']);
    });
  }

  getUser(): IUsuario {
    return localStorage.getItem('usuario') ? JSON.parse(atob(localStorage.getItem('usuario'))) : null;
  }

  setUser(): Promise<boolean> {
    return this.httpClient.get<any>(`${environment.url_faturamento_Identy}/authentication/usuario`).toPromise()
      .then(data => {
        if (data.user) {
          localStorage.setItem('usuario', btoa(JSON.stringify(data.user)));
          return true;
        }
        return false;
      });
  }

  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var userRoles: string[] = JSON.parse(localStorage.getItem('userRoles'));
    //console.log(userRoles);

    if (userRoles == null) { return isMatch; }

    allowedRoles.forEach(element => {
      if (userRoles.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });

    return isMatch;
  }
}
