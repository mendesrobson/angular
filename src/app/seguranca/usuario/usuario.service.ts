import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Usuario } from './models/usuario';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class UsuarioService {

    constructor(private httpClient: HttpClient) { }

    obterUsuario(id: string): Observable<Usuario> {
        return this.httpClient.get<Usuario>(environment.url_identity + "/usuarios/" + id);
    };

    obterTodosUsuario(): Observable<Usuario[]> {
        return this.httpClient.get<Usuario[]>(environment.url_identity + "/usuarios/");
    };

    adicionarUsuario(usuario: Usuario): Observable<Usuario> {
        return this.httpClient.post<Usuario>(environment.url_identity + "/usuarios/register/", usuario);
    };

    excluirUsuario(id: string): Observable<Usuario> {
        return this.httpClient.delete<Usuario>(environment.url_identity + "/usuarios/"+id);
    };

    redefinirSenhaUsuario(usuario: Usuario): Observable<Usuario> {
        return this.httpClient.post<Usuario>(environment.url_identity + "/usuarios/resetpassword/", usuario);
    };

    editarPapeisUsuario(usuario: Usuario): Observable<Usuario> {
        return this.httpClient.post<Usuario>(environment.url_identity + "/usuarios/papeis/", usuario);
    }
 

    
}