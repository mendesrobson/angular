import { Injectable } from "@angular/core";
import { LeiauteArquivoBancario, Banco, RegLeiauteArquivoBancario, IteRegLeiauteArquivoBancario } from "./models/leiautearquivobancario";
import { Observable } from "rxjs";
import { GrupoEmpresa, Empresa } from "../empresa/models/empresa";
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LeiauteArquivoBancarioService {

    constructor(private httpClient: HttpClient) { }

    ObterTodosLeiauteArquivoBancario(): Observable<LeiauteArquivoBancario[]> {
        console.log("ObterTodosLeiauteArquivoBancario");
        return this.httpClient.get<LeiauteArquivoBancario[]>(environment.url_contas_receber + "/LeiauteArquivoBancario/ObterTodosLeiauteArquivoBancario");
    };

    ObterLeiauteArquivoBancarioPorCodigo(codigo: string): Observable<LeiauteArquivoBancario>{
        return this.httpClient.get<LeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/ObterLeiauteArquivoBancarioPorCodigo/" + codigo)
    }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        console.log("obterTodosGrupoEmpresa");
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosBanco(): Observable<Banco[]> {
        console.log("obterTodosBanco");
        return this.httpClient.get<Banco[]>(environment.url_contas_receber + "/Conta/ObterTodosBanco");
    }

    adicionarLeiauteArquivoBancario(leiautearquivobancario: LeiauteArquivoBancario): Observable<LeiauteArquivoBancario> {
        console.log("adicionarLeiauteArquivoBancario");
        return this.httpClient.post<LeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/AdicionarLeiauteArquivoBancario", leiautearquivobancario);
    }

    adicionarRegLeiauteArquivoBancario(regLeiauteArquivoBancario: RegLeiauteArquivoBancario): Observable<RegLeiauteArquivoBancario> {
        console.log("adicionarRegLeiauteArquivoBancario");
        return this.httpClient.post<RegLeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/AdicionarRegLeiauteArquivoBancario", regLeiauteArquivoBancario);
    }

    atualizarRegLeiauteArquivoBancario(regLeiauteArquivoBancario: RegLeiauteArquivoBancario): Observable<RegLeiauteArquivoBancario> {
        console.log("atualizarRegLeiauteArquivoBancario");
        return this.httpClient.post<RegLeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/AtualizarRegLeiauteArquivoBancario", regLeiauteArquivoBancario);
    }

    removerRegLeiauteArquivoBancario(regLeiauteArquivoBancario: RegLeiauteArquivoBancario): Observable<RegLeiauteArquivoBancario> {
        console.log("removerRegLeiauteArquivoBancario");
        return this.httpClient.post<RegLeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/RemoverRegLeiauteArquivoBancario", regLeiauteArquivoBancario);
    }

    removerItemRegistroLeiauteArquivoBancario(iteRegLeiauteArquivoBancario: IteRegLeiauteArquivoBancario): Observable<IteRegLeiauteArquivoBancario> {
        console.log("removerItemRegistroLeiauteArquivoBancario");
        return this.httpClient.post<IteRegLeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/RemoverIteRegLeiauteArquivoBancario", iteRegLeiauteArquivoBancario);
    }

    adicionarItemRegistroLeiauteArquivoBancario(iteRegLeiauteArquivoBancario: IteRegLeiauteArquivoBancario): Observable<IteRegLeiauteArquivoBancario> {
        console.log("adicionarItemRegistroLeiauteArquivoBancario");
        return this.httpClient.post<IteRegLeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/AdicionarIteRegLeiauteArquivoBancario", iteRegLeiauteArquivoBancario);
    }

    atualizarItemRegistroLeiauteArquivoBancario(iteRegLeiauteArquivoBancario: IteRegLeiauteArquivoBancario): Observable<IteRegLeiauteArquivoBancario> {
        console.log("atualizarItemRegistroLeiauteArquivoBancario");
        return this.httpClient.post<IteRegLeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/AtualizarIteRegLeiauteArquivoBancario", iteRegLeiauteArquivoBancario);
    }

    obterLeiauteArquivoBancarioPorId(id: string): Observable<LeiauteArquivoBancario> {
        console.log("obterLeiauteArquivoBancarioPorId");
        return this.httpClient.get<LeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/ObterLeiauteArquivoBancarioPorId/" + id);
    }

    atualizarLeiauteArquivoBancario(leiautearquivobancario: LeiauteArquivoBancario): Observable<LeiauteArquivoBancario> {
        console.log("atualizarLeiauteArquivoBancario");
        return this.httpClient.post<LeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/AtualizarLeiauteArquivoBancario", leiautearquivobancario);
    }

    removerLeiauteArquivoBancario(leiautearquivobancario: LeiauteArquivoBancario): Observable<LeiauteArquivoBancario> {
        console.log("removerLeiauteArquivoBancario");
        return this.httpClient.post<LeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/RemoverLeiauteArquivoBancario", leiautearquivobancario);
    }

    obterCamposLeiauteArquivoBancario() : Observable<any[]> {
        console.log("obterCamposLeiauteArquivoBancario");
        return this.httpClient.get<any[]>(environment.url_contas_receber + "/LeiauteArquivoBancario/ObterCamposLeiauteArquivoBancario/");     
    }

    obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
      }

}