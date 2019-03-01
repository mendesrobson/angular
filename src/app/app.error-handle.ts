import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable()
export class AplicationErrorHandle extends ErrorHandler {

  constructor(private injector: Injector) {
    super();
  }

  handleError(errorResponse: HttpErrorResponse | any ) {
    if (errorResponse instanceof HttpErrorResponse) {
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse.error;
      console.log("HandleError http response: "+error);
    }
    console.log("Erro Response:  "+errorResponse);
    super.handleError(errorResponse);
  }

  goToLogin(): void {
    const router = this.injector.get(Router);
    router.navigate(['authentication/login']);
  }

}
