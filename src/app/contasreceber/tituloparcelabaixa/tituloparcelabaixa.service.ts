import { Injectable, EventEmitter } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

import { BaixaPagarReceber, HistoricoPadrao, MovimentoContaCentro, CentroCusto, CentroResultado, HistoricoPadraoCentro, MovimentoConta, TipoOperacao, LoteMovimentoCaixa, DadosSangriaCaixa, FiltroBaixa, TipoPagamento, BaixaPagarReceberPgto, ControleCartao } from './models/tituloparcelabaixa';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { ContaCorrente, Banco } from '../../cadastros/contacorrente/models/contacorrente';
import { Cliente } from '../../cadastros/cliente/models/cliente';
import { Fornecedor } from '../../cadastros/fornecedor/models/fornecedor';
import { Parcela, ConfiguracaoPagamento } from '../titulo/models/titulo';
import { ChequeFolha } from '../../cadastros/chequeproprio/models/chequeproprio';
import { Administradoracartao } from '../../cadastros/administradoracartao/models/administradoracartao';
import { environment } from '../../../environments/environment';

@Injectable()
export class TituloParcelaBaixaService {


    constructor(private httpClient: HttpClient) { }

    obterTodosBaixaReceber(): Observable<BaixaPagarReceber[]> {
        return this.httpClient.get<BaixaPagarReceber[]>(environment.url_contas_receber + "/Tesouraria/ObterTodosBaixaReceber");
    };

    obterTodosBaixaPagar(): Observable<BaixaPagarReceber[]> {
        return this.httpClient.get<BaixaPagarReceber[]>(environment.url_contas_receber + "/Tesouraria/ObterTodosBaixaPagar");
    };

    ObterBaixaPagarReceberPorCodigo(codigo: string): Observable<BaixaPagarReceber>{
        return this.httpClient.get<BaixaPagarReceber>(environment.url_contas_receber + "/Tesouraria/ObterBaixaPagarReceberPorCodigo/" + codigo);
    }

    obterBaixa(id: string): Observable<BaixaPagarReceber> {
        return this.httpClient.get<BaixaPagarReceber>(environment.url_contas_receber + "/Tesouraria/ObterBaixaPorId/" + id);
        //era uma list no response
    };

    obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
        return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
    };

    obterTodosEmpresa(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
    };

    obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
    };

    obterTodosContaCorrenteCaixa(): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrenteCaixa");
    };

    obterTodosContaCaixaPorEmpresaId(idEmpresa: string): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCaixaPorEmpresaId/"+idEmpresa);
    }

    obterTodosHistoricoPadrao(): Observable<HistoricoPadrao[]> {
        return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadrao");
    };

    obterTodosAdministradoraCartao(): Observable<Administradoracartao[]> {
        return this.httpClient.get<Administradoracartao[]>(environment.url_contas_receber + "/Cartao/ObterTodosAdministradoraCartao");
    };

    obterTodosAdministradoraCartaoPorEmpresaId(idEmpresa: string): Observable<Administradoracartao[]> {
        return this.httpClient.get<Administradoracartao[]>(environment.url_contas_receber + "/Cartao/ObterTodosAdministradoraCartaoPorEmpresaId/"+idEmpresa);
    };

    validarPercentual(movimentoContaCentro: MovimentoContaCentro[]): boolean {
        var valorSomaPercentual = 0;
        for (var i = 0; i < movimentoContaCentro.length; i++) {
            valorSomaPercentual = valorSomaPercentual.valueOf() + movimentoContaCentro[i].percentual.valueOf();
        }

        return valorSomaPercentual > 100 ? false : true;
    };

    adicionarMovimentoContaCentro(movimentoContaCentro: MovimentoContaCentro): Observable<MovimentoContaCentro> {
        return this.httpClient.post<MovimentoContaCentro>(environment.url_contas_receber + "/Titulo/AdicionarMovimentoContaCentro", movimentoContaCentro);
    };

    obterTodosCentroCusto(): Observable<CentroCusto[]> {
        return this.httpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCusto");
    };

    obterTodosCentroResultado(): Observable<CentroResultado[]> {
        return this.httpClient.get<CentroResultado[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultado");
    };

    obterHistoricoPadraoCentroPorId(id: string): Observable<HistoricoPadraoCentro[]> {
        return this.httpClient.get<HistoricoPadraoCentro[]>(environment.url_contas_receber + "/Titulo/ObterHistoricoPadraoCentroPorId/" + id);
    };

    adicionarMovimentoConta(movimentoConta: MovimentoConta): Observable<MovimentoConta> {
        return this.httpClient.post<MovimentoConta>(environment.url_contas_receber + "/Titulo/AdicionarMovimentoConta", movimentoConta);
    };

    ObterMovimentoContaPorCodigo(codigo: string): Observable<MovimentoConta>{
        return this.httpClient.get<MovimentoConta>(environment.url_contas_receber + "/Titulo/ObterMovimentoContaPorCodigo/" + codigo);
    }

    getTipoOperacao() {
        return this.httpClient.get<TipoOperacao[]>('assets/dados/tipooperacao.json');
    };

    adicionarMovimentoContaCaixaPrincipal(movimentoConta: MovimentoConta): Observable<MovimentoConta> {
        return this.httpClient.post<MovimentoConta>(environment.url_contas_receber + "/Titulo/AdicionarMovimentoContaCaixaPrincipal", movimentoConta);
    };

    aberturaCaixa(idContaCorrente: string): Observable<LoteMovimentoCaixa> {
        return this.httpClient.post<LoteMovimentoCaixa>(environment.url_contas_receber + "/Tesouraria/AberturaCaixa/" + idContaCorrente, null);
    };

    fechamentoCaixa(idContaCorrente: string): Observable<LoteMovimentoCaixa> {
        return this.httpClient.post<LoteMovimentoCaixa>(environment.url_contas_receber + "/Tesouraria/FechamentoCaixa/" + idContaCorrente, null);
    };

    sangriaCaixa(dadosSangriaCaixa: DadosSangriaCaixa): Observable<MovimentoConta[]> {
        return this.httpClient.post<MovimentoConta[]>(environment.url_contas_receber + "/Tesouraria/SangriaCaixa/", dadosSangriaCaixa);
    };

    obterTodosMovimentoContaSangria(contaCorrenteId: string): Observable<MovimentoConta[]> {
        return this.httpClient.get<MovimentoConta[]>(environment.url_contas_receber + "/Tesouraria/ObterTodosMovimentoContaSangria/" + contaCorrenteId);
    }

    obterTodosCliente(): Observable<Cliente[]> {
        return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Titulo/ObterTodosCliente");
    }

    obterTodosFornecedor(): Observable<Fornecedor[]> {
        return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedor");
    }

    obterParcelaPorFiltro(filtroBaixa: FiltroBaixa): Observable<Parcela[]> {
        let searchParams = new URLSearchParams();
        for (let param in filtroBaixa) {
            searchParams.set(param, filtroBaixa[param]);
        }

        return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Tesouraria/ObterParcelasPorFiltro?" + searchParams.toString());
    }

    obterTodosTipoPagamentoReceber(): Observable<TipoPagamento[]> {
        return this.httpClient.get<TipoPagamento[]>(environment.url_contas_receber + "/Tesouraria/ObterTodosTipoPagamentoReceber");
    }

    obterTodosTipoPagamentoPagar(): Observable<TipoPagamento[]> {
        return this.httpClient.get<TipoPagamento[]>(environment.url_contas_receber + "/Tesouraria/ObterTodosTipoPagamentoPagar");
    }

    obterTodosContaCorrente(): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterTodosContaCorrente");
    }

    obterTodosContaCaixa(): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterTodosContaCaixa");
    }

    getValorABaixar(parcela: Parcela[], baixaPagarReceberPgto: BaixaPagarReceberPgto[]): number {
        var valorParcela = 0;
        var valorBaixa = 0;
        var valorSoma = 0;
        for (var i = 0; i < parcela.length; i++) {
            valorParcela = valorParcela.valueOf() + parcela[i].valorPago.valueOf();
        }
        for (var i = 0; i < baixaPagarReceberPgto.length; i++) {
            valorBaixa = valorBaixa.valueOf() + baixaPagarReceberPgto[i].valor.valueOf();
        }
        if (valorBaixa < valorParcela) {
            valorSoma = valorParcela.valueOf() - valorBaixa.valueOf();
        } else {
            valorSoma = 0;
        }
        return valorSoma;
    };

    obterTodosChequeFolha(tipo: string): Observable<ChequeFolha[]> {
        return this.httpClient.get<ChequeFolha[]>(environment.url_contas_receber + "/Cheque/ObterTodosChequeFolha/" + tipo);
    };

    obterTodosBanco(): Observable<Banco[]> {
        return this.httpClient.get<Banco[]>(environment.url_contas_receber + "/Conta/ObterTodosBanco");
    };

    adicionarBaixaPagarReceber(baixaPagarReceber: BaixaPagarReceber): Observable<BaixaPagarReceber> {
        return this.httpClient.post<BaixaPagarReceber>(environment.url_contas_receber + "/Tesouraria/AdicionarBaixa", baixaPagarReceber);
    };

    async adicionarChequeFolha(chequeFolha: ChequeFolha): Promise<ChequeFolha> {
        return this.httpClient.post<ChequeFolha>(environment.url_contas_receber + "/Cheque/AdicionarChequeFolha", chequeFolha).toPromise();
    };

    async adicionarControleCartao(controleCartao: ControleCartao): Promise<ControleCartao> {
        return this.httpClient.post<ControleCartao>(environment.url_contas_receber + "/Cartao/AdicionarControleCartao", controleCartao).toPromise();
    };

    obterTodosClientePorEmpresa(idEmpresa: string): Observable<Cliente[]> {
        return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosClientePorEmpresa/" + idEmpresa);
    }


    obterTodosFornecedorPorEmpresa(idEmpresa: string): Observable<Fornecedor[]> {
        return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedorPorEmpresa/" + idEmpresa);
    }

    obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa: string): Observable<ConfiguracaoPagamento[]> {
        return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamentoPorEmpresa/" + idEmpresa);
    }

    obterTodosHistoricoPadraoPorEmpresa(idEmpresa: string): Observable<HistoricoPadrao[]> {
        return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadraoPorEmpresa/" + idEmpresa);
    }

    obterTodosContaCorrentePorEmpresa(idEmpresa: string): Observable<ContaCorrente[]> {
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresa/" + idEmpresa);
    }

    obterTodosContaCorrentePorEmpresaId(idEmpresa: string): Observable<ContaCorrente[]>{
        return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresaId/" + idEmpresa);
    }
}