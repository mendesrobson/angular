import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { Agencia } from '../agencia/models/agencia';
import { Administradoracartao, AdministradoraCartaoEndereco, AdministradoraCartaoContato } from './models/administradoracartao';
import { Banco } from '../banco/models/banco';
import { TipoConta, ContaCorrente } from '../contacorrente/models/contacorrente';
import { TipoLogradouro, Localidade, Uf, Pais, Cargo, Departamento, TipoContato } from '../pessoa/models/pessoa';
import { environment } from '../../../environments/environment';

@Injectable()
export class AdministradoracartaoService {

  constructor(private HttpClient: HttpClient,
    private router: Router) { }

  obterAdministradoraCartao(id: string): Observable<Administradoracartao> {
    return this.HttpClient.get<Administradoracartao>(environment.url_contas_receber + "/Cartao/ObterAdministradoraCartaoPorId/" + id);
  }

  obterContaCorrentePorId(id: string): Observable<ContaCorrente> {
    return this.HttpClient.get<ContaCorrente>(environment.url_contas_receber + "/Conta/ObterContaCorrentePorId/" + id);
  }

  ObterTodosAdministradoraCartao(): Observable<Administradoracartao[]> {
    return this.HttpClient.get<Administradoracartao[]>(environment.url_contas_receber + "/Cartao/ObterTodosAdministradoraCartao");
  }

  ObterAdministradorCartaoPorCodigo(codigo: string): Observable<Administradoracartao>{
    return this.HttpClient.get<Administradoracartao>(environment.url_contas_receber + "/Cartao/ObterAdministradorCartaoPorCodigo/" + codigo);
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.HttpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.HttpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }

  obterTodosAgencia(): Observable<Agencia[]> {
    return this.HttpClient.get<Agencia[]>(environment.url_contas_receber + "/Conta/ObterTodosAgencia");
  }

  obterTodosTipoConta(): Observable<TipoConta[]> {
    return this.HttpClient.get<TipoConta[]>(environment.url_contas_receber + "/Conta/ObterTodosTipoConta");
  }

  obterTodosBanco(): Observable<Banco[]> {
    return this.HttpClient.get<Banco[]>(environment.url_contas_receber + "/Conta/ObterTodosBanco");
  }

  obterTodosContaCorrente(): Observable<ContaCorrente[]> {
    return this.HttpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Conta/ObterTodosContaCorrente");
  }

  obterTodosCargo(): Observable<Cargo[]> {
    return this.HttpClient.get<Cargo[]>(environment.url_folha + "/Cargo/");
  }

  obterTodosDepartamento(): Observable<Departamento[]> {
    return this.HttpClient.get<Departamento[]>(environment.url_contas_receber + "/Pessoa/ObterTodosDepartamento/");
  }

  obterTodosTipoContato(): Observable<TipoContato[]> {
    return this.HttpClient.get<TipoContato[]>(environment.url_contas_receber + "/Pessoa/ObterTodosTipoContato/");
  }

  AdicionarAdministradoraCartao(administradoraCartao: Administradoracartao): Observable<Administradoracartao> {
    return this.HttpClient.post<any>(environment.url_contas_receber + "/Cartao/AdicionarAdministradoraCartao", administradoraCartao);
  }

  AtualizarAdministradoraCartao(administradoraCartao: Administradoracartao): Observable<Administradoracartao> {
    return this.HttpClient.post<any>(environment.url_contas_receber + "/Cartao/AtualizarAdministradoraCartao", administradoraCartao);
  }

  AdicionarAdministradoraCartaoEndereco(administradoraCartaoEndereco: AdministradoraCartaoEndereco): Observable<AdministradoraCartaoEndereco> {
    return this.HttpClient.post<AdministradoraCartaoEndereco>(environment.url_contas_receber + "/Cartao/AdicionarAdministradoraCartaoEndereco", administradoraCartaoEndereco);
  }

  AtualizarAdministradoraCartaoEndereco(administradoraCartaoEndereco: AdministradoraCartaoEndereco): Observable<AdministradoraCartaoEndereco> {
    return this.HttpClient.post<AdministradoraCartaoEndereco>(environment.url_contas_receber + "/Cartao/AtualizarAdministradoraCartaoEndereco", administradoraCartaoEndereco);
  }

  RemoverAdministradoraCartaoEndereco(administradoraCartaoEndereco: AdministradoraCartaoEndereco): Observable<AdministradoraCartaoEndereco> {
    return this.HttpClient.post<AdministradoraCartaoEndereco>(environment.url_contas_receber + "/Cartao/RemoverAdministradoraCartaoEndereco", administradoraCartaoEndereco);
  }

  AdicionarAdministradoraCartaoContato(administradoraCartaoContato: AdministradoraCartaoContato): Observable<AdministradoraCartaoContato> {
    return this.HttpClient.post<AdministradoraCartaoContato>(environment.url_contas_receber + "/Cartao/AdicionarAdministradoraCartaoContato", administradoraCartaoContato);
  }

  AtualizarAdministradoraCartaoContato(administradoraCartaoContato: AdministradoraCartaoContato): Observable<AdministradoraCartaoContato> {
    return this.HttpClient.post<AdministradoraCartaoContato>(environment.url_contas_receber + "/Conta/ObterTodosTipoConta", administradoraCartaoContato);
  }

  RemoverAdministradoraCartaoContato(administradoraCartaoContato: AdministradoraCartaoContato): Observable<AdministradoraCartaoContato> {
    return this.HttpClient.post<AdministradoraCartaoContato>(environment.url_contas_receber + "/Cartao/RemoverAdministradoraCartaoContato", administradoraCartaoContato);
  }

  obterLocalidade(): Observable<Localidade[]> {
    return this.HttpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
  }

  obterLocalidadePorUf(id: string): Observable<Localidade[]> {
    return this.HttpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterLocalidadesPorId/" + id);
  }

  obterTodosUf(): Observable<Uf[]> {
    return this.HttpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
  }

  obterTodosPais() {
    return this.HttpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
  }

  obterTodosTipoLogradouro(): Observable<TipoLogradouro[]> {
    return this.HttpClient.get<TipoLogradouro[]>(environment.url_contas_receber + "/TipoLogradouro/ObterTodosTipoLogradouro");
  }

  obterTodosLocalidadeEndereco(): Observable<Localidade[]> {
    return this.HttpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
  }

  obterTodosUfEndereco(): Observable<Uf[]> {
    return this.HttpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
  }

  obterTodosPaisEndereco(): Observable<Pais[]> {
    return this.HttpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
  }

  obterLocalidadeId(desc: string): Observable<Localidade> {
    return this.HttpClient.get<Localidade>(environment.url_contas_receber + "/Localidade/ObterLocalidadePorDesc/" + desc);
  };

  obterUfId(desc: string): Observable<Uf> {
    return this.HttpClient.get<Uf>(environment.url_contas_receber + "/Uf/ObterUfPorDesc/" + desc);
  };

  obterTipoLogradouroId(desc: string): Observable<TipoLogradouro> {
    return this.HttpClient.get<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/ObterTipoLogradouroPorDesc/" + desc);
  };

  obterPaisId(desc: string): Observable<Pais> {
    return this.HttpClient.get<Pais>(environment.url_contas_receber + "/Pais/ObterPaisPorDesc/" + desc);
  };

  obterTodosContaCorrentePorEmpresa(idEmpresa: string): Observable<ContaCorrente[]> {
    return this.HttpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresaId/" + idEmpresa);
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.HttpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };
}