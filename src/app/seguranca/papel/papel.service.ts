import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable, ErrorHandler } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Papel } from './models/papel';


@Injectable()
export class PapelService {

    constructor(private httpClient: HttpClient) { }

    obterPapel(id: string): Observable<Papel> {
        return this.httpClient.get<Papel>(environment.url_identity + "/Roles/" + id);
    };

    obterTodosPapel(): Observable<Papel[]> {
        return this.httpClient.get<Papel[]>(environment.url_identity + "/Roles/");
    };

    adicionarPapel(papel: Papel): Observable<Papel> {
        return this.httpClient.post<Papel>(environment.url_identity + "/Roles/", papel);         
    };

    excluirPapel(id: string): Observable<Papel> {
        return this.httpClient.delete<Papel>(environment.url_identity + "/Roles/" + id);
    };

}
