import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Renegociacao, RenegociacaoParcela, FiltroRenegociacao, TipoCobranca, Desconto } from './models/renegociacao';
import { Parcela, ConfiguracaoPagamento, ContaCorrente, Titulo } from '../titulo/models/titulo';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Cliente } from '../../cadastros/cliente/models/cliente';
import { FiltroRemessa } from '../remessa/models/remessa';
import { Fornecedor } from '../../cadastros/fornecedor/models/fornecedor';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class RenegociacaoService {

    constructor(private httpClient: HttpClient) { }

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    }

    // obterTodosEmpresa(): Observable<Empresa[]> {
    //     return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    // }

    obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };

    ObterTodosRenegociacao(): Observable<Renegociacao[]> {
        return this.httpClient.get<Renegociacao[]>(environment.url_contas_receber + "/Titulo/ObterTodosRenegociacao");
    };

    obterRenegociacao(id: string): Observable<Renegociacao> {
        return this.httpClient.get<Renegociacao>(environment.url_contas_receber + "/Titulo/ObterRenegociacaoPorId/" + id);

    };

    obterTodosClientePorEmpresa(idEmpresa: string): Observable<Cliente[]> {
        return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosClientePorEmpresa/" + idEmpresa);
    }

    obterTodosCliente(): Observable<Cliente[]> {
        return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Titulo/ObterTodosCliente");
    }

    obterTodosFornecedorPorEmpresa(idEmpresa: string): Observable<Fornecedor[]> {
        return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedorPorEmpresa/" + idEmpresa);
    }

    obterTodosFornecedor(): Observable<Fornecedor[]> {
        return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedor");
    }

    obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa: string): Observable<ConfiguracaoPagamento[]> {
        return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamentoPorEmpresa/" + idEmpresa);
    }

    // obterTodosConfiguracaoPagamento(): Observable<ConfiguracaoPagamento[]> {
    //     return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamento")
    // }

    obterTodosContaCorrentePorEmpresa(idEmpresa: string): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresaId/" + idEmpresa);
    }

    obterTodosContaCorrente(): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrente");
    }

    obterTodosDescontoPorEmpresa(idEmpresa: string): Observable<Desconto[]> {
        return this.httpClient.get<Desconto[]>(environment.url_contas_receber + "/Titulo/ObterTodosDescontoPorEmpresa/" + idEmpresa);
    }

    obterTodosDesconto(): Observable<Desconto[]> {
        return this.httpClient.get<Desconto[]>(environment.url_contas_receber + "/Titulo/ObterDescontos");
    }

    obterTodosTipoCobranca(): Observable<TipoCobranca[]> {
        return this.httpClient.get<TipoCobranca[]>(environment.url_contas_receber + "/Titulo/ObterTodosTipoCobranca");
    }

    obterTodosRenegociacaoPorNaturezaId(id: number): Observable<Renegociacao[]> {
        return this.httpClient.get<Renegociacao[]>(environment.url_contas_receber + "/Titulo/ObterTodosRenegociacaoPorNaturezaId/" + id);
    };

    AdicionarRenegociacao(renegociacao: Renegociacao): Observable<Renegociacao> {
        return this.httpClient.post<Renegociacao>(environment.url_contas_receber + "/Titulo/AdicionarRenegociacao", renegociacao);
    };

    AtualizarSituacaoParcela(parcelas: Parcela[]): Observable<Parcela> {
        return this.httpClient.post<Parcela>(environment.url_contas_receber + "/Titulo/AtualizarSituacaoParcela", parcelas);
    };

    AdicionarTitulo(titulo: Titulo): Observable<Titulo> {
        return this.httpClient.post<Titulo>(environment.url_contas_receber + "/Titulo/AdicionarTitulo", titulo);

    };

    obterParcelaPorFiltro(filtroRenegociacao: FiltroRenegociacao): Observable<Parcela[]> {
        let searchParams = new URLSearchParams();
        for (let param in filtroRenegociacao) {
            searchParams.set(param, filtroRenegociacao[param]);
        }

        return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Titulo/ObterParcelasPorFiltro?" + searchParams.toString());
    }

    GerarTituloParcelaAngular(renegociacao: Renegociacao): Observable<Titulo> {
        return this.httpClient.post<Titulo>(environment.url_contas_receber + "/Titulo/GerarTituloParcelaAngular", renegociacao);
    };


    AtualizarParcela(parcelaRenegociada: Parcela): Observable<Parcela> {
        return this.httpClient.post<Parcela>(environment.url_contas_receber + "/Titulo/AtualizarParcela", parcelaRenegociada);
    }

    obterConfiguracaoPagamentoId(id: string): Observable<ConfiguracaoPagamento> {
        return this.httpClient.get<ConfiguracaoPagamento>(environment.url_contas_receber + "/Titulo/ObterConfiguracaoPagamentoPorId/" + id);
    };

    obterDescontoPorId(id: string): Observable<Desconto> {
        return this.httpClient.get<Desconto>(environment.url_contas_receber + "/Titulo/ObterDescontoPorId/" + id);
    };
}