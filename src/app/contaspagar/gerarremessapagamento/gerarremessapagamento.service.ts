import { Injectable } from "@angular/core";
import { GrupoEmpresa, Empresa } from "../../cadastros/empresa/models/empresa";
import { Observable } from "rxjs/Observable";
import { ContaCorrente, Fornecedor, FiltroRemessaPagamento, VwCamposLeiauteArqBancario, LeiauteArquivoBancarioParcelas, ArquivoRemessa } from "./models/remessapagamento";
import { Parcela } from "../../contasreceber/alterarvencimentolote/models/parcela";
import { LeiauteArquivoBancario } from "../../cadastros/leiautearquivobancario/models/leiautearquivobancario";
import { retry } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GerarRemessaPagamentoService {

  constructor(private httpClient: HttpClient) { }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }

  obterContasCorrente(): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterTodosContaCorrente");
  }

  obterTodosFornecedor(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedor");
  }

  obterParcelasParaRemessa(filtro: FiltroRemessaPagamento, fornecedores: string): Observable<VwCamposLeiauteArqBancario[]> {
    let searchParams = new URLSearchParams();
    for (let param in filtro) {
      if (param != "fornecedores")
        searchParams.set(param, filtro[param]);
    }

    return this.httpClient.get<VwCamposLeiauteArqBancario[]>(environment.url_contas_receber + "/LeiauteArquivoBancario/ParcelasParaRemessa?" + searchParams.toString() + "&" + fornecedores);
  }

  obterLeiauteArquivoBancarioPorBanco(empresaId, grupoEmpresaId, contaCorrenteId: string): Observable<LeiauteArquivoBancario> {
    let searchParams = new URLSearchParams();
    searchParams.set('empresaId', empresaId);
    searchParams.set('grupoEmpresaId', grupoEmpresaId);
    searchParams.set('contaCorrenteId', contaCorrenteId);

    return this.httpClient.get<LeiauteArquivoBancario>(environment.url_contas_receber + "/LeiauteArquivoBancario/ObterLeiauteArquivoBancarioPorBanco?" + searchParams.toString());
  }

  gerarRemessaPagamento(leiauteArquivoBancarioParcelas : LeiauteArquivoBancarioParcelas): any {
    return this.httpClient.post<any>(environment.url_contas_receber + "/LeiauteArquivoBancario/GerarRemessaPagamento", leiauteArquivoBancarioParcelas);  
  }

  obterTodosFornecedorPorEmpresa(idEmpresa: string): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedorPorEmpresa/" + idEmpresa);
  }
    
  obterTodosContaCorrentePorEmpresa(idEmpresa: string): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresa/" + idEmpresa);
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
};
}