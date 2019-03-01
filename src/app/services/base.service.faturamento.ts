// import { Http, Headers, Response, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Observable';

// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/observable/throw';


// export abstract class BaseServiceFaturamento {
//   constructor() {  }

//   protected UrlServiceV1: string = "http://localhost:52109/api";
//   protected UrlServiceV2: string = "http://localhost:51938/api";
//   // protected UrlServiceV1: string = "http://192.168.31.10:8020/faturamento/api";
//   // protected UrlServiceV2: string = "http://192.168.31.10:8020/contasreceber/api"\
//   protected obterAuthHeader(): RequestOptions {
//     let headers = new Headers({ 'Content-Type': 'application/json' });
//     let options = new RequestOptions({ headers: headers });
//     return options;
//   }

//   protected serviceError(error: Response | any) {
//     let errMsg: string;
//     if (error instanceof Response) {
//       const body = error.json() || '';
//       const err = body.error || JSON.stringify(body);
//       errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
//     } else {
//       errMsg = error.message ? error.message : error.toString();
//     }
//     console.error(error);
//     return Observable.throw(error);
//   }

//   protected extractData(response: Response) {
//     let body = response.json();
//     return body.data || {};
//   }

// }