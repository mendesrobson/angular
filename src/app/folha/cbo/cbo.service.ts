import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cbo } from './models/cbo';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CboService {

    constructor(private httpClient: HttpClient) { }
    
    obterCbo(id: string): Observable<Cbo> {
        return this.httpClient.get<Cbo>(environment.url_folha + "/Cbo/" + id);
    };

    obterTodosCbo(): Observable<Cbo[]> {
        return this.httpClient.get<Cbo[]>(environment.url_folha + "/Cbo/");
    };

    adicionarCbo(cbo: Cbo): Observable<Cbo> {
        return this.httpClient.post<Cbo>(environment.url_folha + "/Cbo/", cbo);
    };

    atualizarCbo(cbo: Cbo): Observable<Cbo> {
        return this.httpClient.put<Cbo>(environment.url_folha + "/Cbo/", cbo);
    };

    removerCbo(cbo: Cbo): Observable<Cbo> {
        return this.httpClient.put<Cbo>(environment.url_folha + "/Cbo/Remove/", cbo);
    };

    reativarCbo(cbo: Cbo): Observable<Cbo> {
        return this.httpClient.put<Cbo>(environment.url_folha + "/Cbo/Reactive/", cbo);
    };

}
