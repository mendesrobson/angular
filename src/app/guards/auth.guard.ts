import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../authentication/login/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.check()) {
      console.log("CanActivate true");
      return true;
    }
    this.router.navigate(['authentication/login']);
    console.log("CanActivate False");
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.check()) {
      console.log("canActivateChild true");
      return true;
    }
    this.router.navigate(['authentication/login']);
    console.log("canActivateChild false");
    return false;
  }
}
